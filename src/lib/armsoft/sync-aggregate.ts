import type {
  ArmsoftProductRemainderRow,
  ArmsoftStockBySku,
} from "./types";
import { normalizeSku } from "./sku-normalize";

export function aggregateRemaindersBySku(
  rows: ArmsoftProductRemainderRow[],
  storageFilter: string | null,
): Map<string, ArmsoftStockBySku> {
  const bySku = new Map<string, ArmsoftStockBySku>();

  for (const row of rows) {
    const sku = normalizeSku(String(row.product ?? ""));
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
        imageUrl: null,
        availableQuantity: available,
        reservedQuantity: reserved,
        priceAmd: priceAmd > 0 ? priceAmd : 0,
        hasStockData: true,
      });
      continue;
    }

    existing.availableQuantity += available;
    existing.reservedQuantity += reserved;
    existing.hasStockData = true;
    if (priceAmd > 0) {
      existing.priceAmd = priceAmd;
    }
    if (!existing.productName && row.productName) {
      existing.productName = row.productName;
    }
  }

  return bySku;
}

export function mergeSalePricesIntoSkuMap(
  bySku: Map<string, ArmsoftStockBySku>,
  salePricesBySku: Map<string, number>,
): void {
  for (const [sku, priceAmd] of salePricesBySku) {
    if (!(priceAmd > 0)) {
      continue;
    }

    const existing = bySku.get(sku);
    if (existing) {
      existing.priceAmd = priceAmd;
      continue;
    }

    bySku.set(sku, {
      sku,
      productName: null,
      imageUrl: null,
      availableQuantity: 0,
      reservedQuantity: 0,
      priceAmd,
      hasStockData: false,
    });
  }
}

/**
 * Ensures every ArmSoft directory SKU is in the sync map.
 * No remainder row = authoritative stock 0 (ArmSoft is source of truth).
 */
export function seedDirectorySkusIntoMap(
  bySku: Map<string, ArmsoftStockBySku>,
  directoryBySku: Map<
    string,
    { productName: string | null; imageUrl: string | null }
  >,
): void {
  for (const [sku, directoryItem] of directoryBySku) {
    const existing = bySku.get(sku);
    if (!existing) {
      bySku.set(sku, {
        sku,
        productName: directoryItem.productName,
        imageUrl: directoryItem.imageUrl,
        availableQuantity: 0,
        reservedQuantity: 0,
        priceAmd: 0,
        hasStockData: true,
      });
      continue;
    }

    if (!existing.hasStockData) {
      existing.hasStockData = true;
      existing.availableQuantity = 0;
      existing.reservedQuantity = 0;
    }

    if (!existing.productName && directoryItem.productName) {
      existing.productName = directoryItem.productName;
    }
    if (!existing.imageUrl && directoryItem.imageUrl) {
      existing.imageUrl = directoryItem.imageUrl;
    }
  }
}
