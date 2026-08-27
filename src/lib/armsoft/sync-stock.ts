import { db } from "@white-shop/db";
import { revalidateTag } from "next/cache";
import {
  invalidateProductPageCaches,
  invalidateStorefrontProductRelatedCaches,
} from "@/lib/cache/storefront-cache";
import { CURRENCIES } from "@/lib/currency";
import { cacheService } from "@/lib/services/cache.service";
import { logger } from "@/lib/utils/logger";
import { armsoftClient } from "./client";
import { getArmsoftSmConfig } from "./config";
import { ARMSOFT_STOCK_UPDATE_BATCH_SIZE } from "./constants";
import type {
  ArmsoftProductRemainderRow,
  ArmsoftStockBySku,
  ArmsoftStockSyncResult,
} from "./types";

const HY_LOCALE = "hy";
const PRICE_EPSILON = 0.005;

function toNonNegativeInt(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.trunc(value));
}

function amdToUsd(priceAmd: number, amdRate: number): number {
  if (!Number.isFinite(priceAmd) || priceAmd <= 0 || amdRate <= 0) {
    return 0;
  }
  return Math.round((priceAmd / amdRate) * 100) / 100;
}

function pricesEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < PRICE_EPSILON;
}

function aggregateRemaindersBySku(
  rows: ArmsoftProductRemainderRow[],
  storageFilter: string | null,
): Map<string, ArmsoftStockBySku> {
  const bySku = new Map<string, ArmsoftStockBySku>();

  for (const row of rows) {
    const sku = String(row.product ?? "").trim();
    if (!sku) {
      continue;
    }

    if (storageFilter) {
      const storage = String(row.storage ?? "").trim();
      if (storage !== storageFilter) {
        continue;
      }
    }

    const available = Number(row.availableQuantity ?? 0);
    const reserved = Number(row.reservedQuantity ?? 0);
    const priceAmd = Number(row.price ?? 0);
    const existing = bySku.get(sku);

    if (!existing) {
      bySku.set(sku, {
        sku,
        productName: row.productName ?? null,
        availableQuantity: available,
        reservedQuantity: reserved,
        priceAmd: priceAmd > 0 ? priceAmd : 0,
      });
      continue;
    }

    existing.availableQuantity += available;
    existing.reservedQuantity += reserved;
    if (priceAmd > 0) {
      existing.priceAmd = priceAmd;
    }
    if (!existing.productName && row.productName) {
      existing.productName = row.productName;
    }
  }

  return bySku;
}

async function resolveAmdToUsdRate(): Promise<number> {
  const envRate = Number.parseFloat(
    process.env.ARMSOFT_SM_AMD_TO_USD_RATE?.trim() ?? "",
  );
  if (Number.isFinite(envRate) && envRate > 0) {
    return envRate;
  }

  const setting = await db.settings.findUnique({
    where: { key: "currencyRates" },
    select: { value: true },
  });

  if (setting?.value && typeof setting.value === "object") {
    const rates = setting.value as Record<string, unknown>;
    const amd = Number(rates.AMD);
    if (Number.isFinite(amd) && amd > 0) {
      return amd;
    }
  }

  return CURRENCIES.AMD.rate;
}

async function invalidateAfterSync(): Promise<void> {
  try {
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag("products");
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag("home-featured");
    await cacheService.deletePattern("products:*");
    await cacheService.deletePattern("cart:view:v1:*");
    await invalidateProductPageCaches();
    await invalidateStorefrontProductRelatedCaches();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("ArmSoft catalog sync cache invalidation failed", { message });
  }
}

/**
 * Pulls ArmSoft remainders and syncs stock, price (AMD→USD), and hy title by SKU.
 * Images are not available in SM Public API. Zero ArmSoft prices leave shop price unchanged.
 */
export async function syncArmsoftStockToDb(): Promise<ArmsoftStockSyncResult> {
  const config = getArmsoftSmConfig();
  const amdToUsdRate = await resolveAmdToUsdRate();
  const rows = await armsoftClient.fetchAllProductRemainders();
  const bySku = aggregateRemaindersBySku(rows, config.storageFilter);

  const variants = await db.productVariant.findMany({
    where: { sku: { not: null } },
    select: {
      id: true,
      sku: true,
      stock: true,
      stockReserved: true,
      price: true,
      productId: true,
      product: {
        select: {
          translations: {
            where: { locale: HY_LOCALE },
            select: { id: true, title: true },
            take: 1,
          },
        },
      },
    },
  });

  const stockUpdates: Array<{ id: string; stock: number; stockReserved: number }> = [];
  const priceUpdates: Array<{ id: string; price: number }> = [];
  const nameUpdates: Array<{ translationId: string; title: string }> = [];

  let matched = 0;
  let unchanged = 0;
  const matchedSkus = new Set<string>();

  for (const variant of variants) {
    const sku = variant.sku?.trim();
    if (!sku) {
      continue;
    }

    const armsoft = bySku.get(sku);
    if (!armsoft) {
      continue;
    }

    matched += 1;
    matchedSkus.add(sku);

    const nextStock = toNonNegativeInt(armsoft.availableQuantity);
    const nextReserved = toNonNegativeInt(armsoft.reservedQuantity);
    let changed = false;

    if (variant.stock !== nextStock || variant.stockReserved !== nextReserved) {
      stockUpdates.push({
        id: variant.id,
        stock: nextStock,
        stockReserved: nextReserved,
      });
      changed = true;
    }

    if (armsoft.priceAmd > 0) {
      const nextPrice = amdToUsd(armsoft.priceAmd, amdToUsdRate);
      if (!pricesEqual(variant.price, nextPrice)) {
        priceUpdates.push({ id: variant.id, price: nextPrice });
        changed = true;
      }
    }

    const nextName = armsoft.productName?.trim() ?? "";
    const hyTranslation = variant.product.translations[0];
    if (nextName && hyTranslation && hyTranslation.title.trim() !== nextName) {
      nameUpdates.push({ translationId: hyTranslation.id, title: nextName });
      changed = true;
    }

    if (!changed) {
      unchanged += 1;
    }
  }

  for (
    let index = 0;
    index < stockUpdates.length;
    index += ARMSOFT_STOCK_UPDATE_BATCH_SIZE
  ) {
    const batch = stockUpdates.slice(index, index + ARMSOFT_STOCK_UPDATE_BATCH_SIZE);
    await db.$transaction(
      batch.map((item) =>
        db.productVariant.update({
          where: { id: item.id },
          data: { stock: item.stock, stockReserved: item.stockReserved },
        }),
      ),
    );
  }

  for (
    let index = 0;
    index < priceUpdates.length;
    index += ARMSOFT_STOCK_UPDATE_BATCH_SIZE
  ) {
    const batch = priceUpdates.slice(index, index + ARMSOFT_STOCK_UPDATE_BATCH_SIZE);
    await db.$transaction(
      batch.map((item) =>
        db.productVariant.update({
          where: { id: item.id },
          data: { price: item.price },
        }),
      ),
    );
  }

  for (
    let index = 0;
    index < nameUpdates.length;
    index += ARMSOFT_STOCK_UPDATE_BATCH_SIZE
  ) {
    const batch = nameUpdates.slice(index, index + ARMSOFT_STOCK_UPDATE_BATCH_SIZE);
    await db.$transaction(
      batch.map((item) =>
        db.productTranslation.update({
          where: { id: item.translationId },
          data: { title: item.title },
        }),
      ),
    );
  }

  const anyUpdates =
    stockUpdates.length > 0 || priceUpdates.length > 0 || nameUpdates.length > 0;
  if (anyUpdates) {
    await invalidateAfterSync();
  }

  const missingSkus = [...bySku.keys()].filter((sku) => !matchedSkus.has(sku));

  const result: ArmsoftStockSyncResult = {
    fetchedRows: rows.length,
    uniqueSkus: bySku.size,
    matched,
    updatedStock: stockUpdates.length,
    updatedPrice: priceUpdates.length,
    updatedName: nameUpdates.length,
    unchanged,
    missingInDb: missingSkus.length,
    missingSkus: missingSkus.slice(0, 50),
    pricelistType: config.pricelistType,
    amdToUsdRate,
  };

  logger.warn("ArmSoft catalog sync completed", result);
  return result;
}
