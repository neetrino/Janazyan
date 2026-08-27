export interface ArmsoftProductRemainderRow {
  storage?: string | null;
  storageName?: string | null;
  product?: string | null;
  productName?: string | null;
  measureUnit?: string | null;
  quantity?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  price?: number;
  productGroup?: string | null;
  productGroupName?: string | null;
}

export interface ArmsoftRemaindersPage {
  id: string;
  hasMore: boolean;
  data: ArmsoftProductRemainderRow[] | null;
}

export interface ArmsoftStockBySku {
  sku: string;
  productName: string | null;
  availableQuantity: number;
  reservedQuantity: number;
  /** ArmSoft price in AMD (pricelist); 0 when unset. */
  priceAmd: number;
}

export interface ArmsoftStockSyncResult {
  fetchedRows: number;
  uniqueSkus: number;
  matched: number;
  updatedStock: number;
  updatedPrice: number;
  updatedName: number;
  unchanged: number;
  missingInDb: number;
  missingSkus: string[];
  pricelistType: string;
  amdToUsdRate: number;
}

/** @deprecated Use ArmsoftStockSyncResult */
export type ArmsoftCatalogSyncResult = ArmsoftStockSyncResult;
