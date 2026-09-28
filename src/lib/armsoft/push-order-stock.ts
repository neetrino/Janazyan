import { convertPrice } from "@/lib/currency";
import { logger } from "@/lib/utils/logger";
import { createProductsOutputDocument } from "./client";
import { getArmsoftSmConfig } from "./config";
import { ARMSOFT_PRODUCTS_OUTPUT_POSTED_STATE } from "./constants";
import { normalizeSku } from "./sku-normalize";

export interface ArmsoftOrderStockLine {
  sku: string | null | undefined;
  quantity: number;
  /** Shop variant price in USD. */
  priceUsd: number;
}

export interface PushOrderStockToArmsoftInput {
  orderNumber: string;
  lines: ArmsoftOrderStockLine[];
}

export function isArmsoftOrderWritebackEnabled(): boolean {
  const raw = process.env.ARMSOFT_SM_ORDER_WRITEBACK?.trim().toLowerCase();
  if (raw === "0" || raw === "false" || raw === "off") {
    return false;
  }
  // Default on when ArmSoft is configured.
  return Boolean(process.env.ARMSOFT_SM_API_KEY?.trim());
}

function resolveOutputStorage(): string {
  const explicit = process.env.ARMSOFT_SM_OUTPUT_STORAGE?.trim();
  if (explicit) {
    return explicit;
  }
  return getArmsoftSmConfig().storageFilter ?? "000";
}

/**
 * Pushes a shop sale to ArmSoft as ProductsOutput so warehouse stock decreases.
 * Failures are logged; checkout is not rolled back (API key may lack write permission).
 */
export async function pushOrderStockToArmsoft(
  input: PushOrderStockToArmsoftInput,
): Promise<{ ok: boolean; isn?: string; skipped?: boolean }> {
  if (!isArmsoftOrderWritebackEnabled()) {
    return { ok: true, skipped: true };
  }

  const products = input.lines
    .map((line) => {
      const code = normalizeSku(line.sku ?? "");
      const quantity = Number(line.quantity);
      if (!code || !(quantity > 0)) {
        return null;
      }
      const priceAmd = convertPrice(line.priceUsd, "USD", "AMD");
      const price = Math.round(priceAmd * 100) / 100;
      return {
        code,
        quantity,
        price,
        sum: Math.round(price * quantity * 100) / 100,
        storageOut: resolveOutputStorage(),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (products.length === 0) {
    logger.warn("ArmSoft order writeback skipped: no valid SKU lines", {
      orderNumber: input.orderNumber,
    });
    return { ok: true, skipped: true };
  }

  try {
    const config = getArmsoftSmConfig();
    const storage = resolveOutputStorage();
    const doc = await createProductsOutputDocument({
      docDate: new Date().toISOString().slice(0, 10),
      docNum: input.orderNumber,
      comment: `Shop order ${input.orderNumber}`,
      state: ARMSOFT_PRODUCTS_OUTPUT_POSTED_STATE,
      pricelistType: config.pricelistType,
      storage,
      products,
    });

    logger.warn("ArmSoft order writeback succeeded", {
      orderNumber: input.orderNumber,
      isn: doc.isn,
      lines: products.length,
    });
    return { ok: true, isn: doc.isn };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const detail =
      error && typeof error === "object" && "detail" in error
        ? String((error as { detail?: unknown }).detail ?? "")
        : message;
    logger.error("ArmSoft order writeback failed", {
      orderNumber: input.orderNumber,
      detail,
      error,
    });
    return { ok: false };
  }
}
