import { db } from "@white-shop/db";
import { CURRENCIES } from "@/lib/currency";
import { logger } from "@/lib/utils/logger";
import { armsoftClient, extractArmsoftProductImageUrl } from "./client";
import { getArmsoftSmConfig } from "./config";
import { ARMSOFT_STOCK_UPDATE_BATCH_SIZE } from "./constants";
import { buildSkuCandidates, normalizeSku } from "./sku-normalize";
import {
  aggregateRemaindersBySku,
  mergeSalePricesIntoSkuMap,
  seedDirectorySkusIntoMap,
} from "./sync-aggregate";
import { invalidateAfterArmsoftSync } from "./sync-cache";
import { loadHeldUnpostedQtyByVariant } from "./unposted-reservations";
import type { ArmsoftStockSyncResult } from "./types";

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

async function applyUpdatesInBatches(
  stockUpdates: Array<{ id: string; stock: number; stockReserved: number }>,
  priceUpdates: Array<{ id: string; price: number }>,
  nameUpdates: Array<{ translationId: string; title: string }>,
  mediaUpdates: Array<{ productId: string; media: string[] }>,
): Promise<void> {
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

  for (
    let index = 0;
    index < mediaUpdates.length;
    index += ARMSOFT_STOCK_UPDATE_BATCH_SIZE
  ) {
    const batch = mediaUpdates.slice(index, index + ARMSOFT_STOCK_UPDATE_BATCH_SIZE);
    await db.$transaction(
      batch.map((item) =>
        db.product.update({
          where: { id: item.productId },
          data: { media: item.media },
        }),
      ),
    );
  }
}

function readStringMediaUrls(media: unknown): string[] {
  if (!Array.isArray(media)) {
    return [];
  }

  return media
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
}

function shouldReplaceMedia(currentMedia: unknown, nextImageUrl: string): boolean {
  const currentUrls = readStringMediaUrls(currentMedia);
  if (currentUrls.length === 0) {
    return true;
  }

  return currentUrls[0] !== nextImageUrl;
}

/**
 * Pulls ArmSoft remainders + pricelist sale prices and syncs stock, price (AMD→USD),
 * hy title, and main image by SKU when ArmSoft provides an image URL.
 * ArmSoft is source of truth: cron polls every 15m (no webhook in SM Public API).
 */
export async function syncArmsoftStockToDb(): Promise<ArmsoftStockSyncResult> {
  const config = getArmsoftSmConfig();
  const amdToUsdRate = await resolveAmdToUsdRate();
  const rows = await armsoftClient.fetchAllProductRemainders();
  const productsDirectory = await armsoftClient.fetchAllProducts();
  const bySku = aggregateRemaindersBySku(rows, config.storageFilter);
  const directoryBySku = new Map<
    string,
    { productName: string | null; imageUrl: string | null }
  >();

  for (const product of productsDirectory) {
    const sku = normalizeSku(String(product.code ?? ""));
    if (!sku) {
      continue;
    }

    const imageUrl = extractArmsoftProductImageUrl(product);
    const productName = product.fullName?.trim() || product.name?.trim() || null;
    directoryBySku.set(sku, { productName, imageUrl });
  }

  const heldByVariant = await loadHeldUnpostedQtyByVariant();
  const variants = await db.productVariant.findMany({
    where: { sku: { not: null } },
    select: {
      id: true,
      sku: true,
      stock: true,
      stockReserved: true,
      price: true,
      product: {
        select: {
          id: true,
          media: true,
          translations: {
            where: { locale: HY_LOCALE },
            select: { id: true, title: true },
            take: 1,
          },
        },
      },
    },
  });

  const priceLookupSkus = [
    ...new Set([
      ...bySku.keys(),
      ...directoryBySku.keys(),
      ...variants
        .map((variant) => normalizeSku(variant.sku ?? ""))
        .filter((sku) => sku.length > 0),
    ]),
  ];
  const salePricesBySku = await armsoftClient.fetchSalePricesBySku(
    priceLookupSkus,
    undefined,
    productsDirectory,
  );
  mergeSalePricesIntoSkuMap(bySku, salePricesBySku);
  seedDirectorySkusIntoMap(bySku, directoryBySku);

  const stockUpdates: Array<{ id: string; stock: number; stockReserved: number }> = [];
  const priceUpdates: Array<{ id: string; price: number }> = [];
  const nameUpdates: Array<{ translationId: string; title: string }> = [];
  const mediaUpdatesByProduct = new Map<string, string[]>();

  let matched = 0;
  let unchanged = 0;
  const matchedSkus = new Set<string>();
  const missingVariantSkusSet = new Set<string>();

  for (const variant of variants) {
    const rawSku = variant.sku?.trim() ?? "";
    if (!rawSku) {
      continue;
    }

    const skuCandidates = buildSkuCandidates(rawSku);
    const matchedSku = skuCandidates.find((candidate) => bySku.has(candidate));
    if (!matchedSku) {
      const normalized = normalizeSku(rawSku);
      if (normalized && !directoryBySku.has(normalized)) {
        missingVariantSkusSet.add(normalized);
      }
      continue;
    }

    const armsoft = bySku.get(matchedSku);
    if (!armsoft) {
      continue;
    }

    matched += 1;
    matchedSkus.add(matchedSku);
    let changed = false;

    if (armsoft.hasStockData) {
      const heldQty = heldByVariant.get(variant.id) ?? 0;
      const nextStock = toNonNegativeInt(armsoft.availableQuantity - heldQty);
      const nextReserved = toNonNegativeInt(armsoft.reservedQuantity);
      if (variant.stock !== nextStock || variant.stockReserved !== nextReserved) {
        stockUpdates.push({
          id: variant.id,
          stock: nextStock,
          stockReserved: nextReserved,
        });
        changed = true;
      }
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

    const nextImageUrl = armsoft.imageUrl?.trim() ?? "";
    if (nextImageUrl && shouldReplaceMedia(variant.product.media, nextImageUrl)) {
      mediaUpdatesByProduct.set(variant.product.id, [nextImageUrl]);
      changed = true;
    }

    if (!changed) {
      unchanged += 1;
    }
  }

  const mediaUpdates = [...mediaUpdatesByProduct].map(([productId, media]) => ({
    productId,
    media,
  }));

  await applyUpdatesInBatches(
    stockUpdates,
    priceUpdates,
    nameUpdates,
    mediaUpdates,
  );

  if (
    stockUpdates.length > 0 ||
    priceUpdates.length > 0 ||
    nameUpdates.length > 0 ||
    mediaUpdates.length > 0
  ) {
    await invalidateAfterArmsoftSync();
  }

  const missingSkus = [...bySku.keys()].filter((sku) => !matchedSkus.has(sku));
  const result: ArmsoftStockSyncResult = {
    fetchedRows: rows.length,
    uniqueSkus: bySku.size,
    matched,
    updatedStock: stockUpdates.length,
    updatedPrice: priceUpdates.length,
    updatedName: nameUpdates.length,
    updatedMedia: mediaUpdates.length,
    unchanged,
    missingInDb: missingSkus.length,
    missingSkus: missingSkus.slice(0, 50),
    missingInArmsoft: missingVariantSkusSet.size,
    missingVariantSkus: [...missingVariantSkusSet].slice(0, 50),
    pricelistType: config.pricelistType,
    amdToUsdRate,
    pricesFetched: salePricesBySku.size,
  };

  logger.warn("ArmSoft catalog sync completed", result);
  return result;
}
