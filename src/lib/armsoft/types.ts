export interface ArmsoftProductRemainderRow {
  storage?: string | null;
  storageName?: string | null;
  product?: string | null;
  productName?: string | null;
  measureUnit?: string | null;
  quantity?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  /** Present only if ArmSoft remainders include pricelist columns (often absent). */
  price?: number;
  productGroup?: string | null;
  productGroupName?: string | null;
}

export interface ArmsoftRemaindersPage {
  id: string;
  hasMore: boolean;
  data: ArmsoftProductRemainderRow[] | null;
}

export interface ArmsoftProductDirectoryRow {
  id: number;
  code?: string | null;
  name?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
  pictureUrl?: string | null;
  externalCode?: string | null;
}

export interface ArmsoftProductsPage {
  id: string;
  hasMore: boolean;
  data: ArmsoftProductDirectoryRow[] | null;
}

export interface ArmsoftSalePriceRow {
  productId: number;
  salePrice: number;
}

export interface ArmsoftProductsOutputLine {
  code: string;
  quantity: number;
  price: number;
  sum: number;
  storageOut?: string | null;
  storageIn?: string | null;
  additionalInfo?: string | null;
}

export interface ArmsoftProductsOutputDocument {
  isn?: string;
  comment?: string | null;
  docDate: string;
  docNum?: string | null;
  state: number;
  pricelistType?: string | null;
  storage?: string | null;
  surrender?: string | null;
  products: ArmsoftProductsOutputLine[];
}

export interface ArmsoftStockBySku {
  sku: string;
  productName: string | null;
  imageUrl: string | null;
  availableQuantity: number;
  reservedQuantity: number;
  /** ArmSoft price in AMD (pricelist); 0 when unset. */
  priceAmd: number;
  /** True when this SKU appeared in remainders (stock is authoritative). */
  hasStockData: boolean;
}

export interface ArmsoftStockSyncResult {
  fetchedRows: number;
  uniqueSkus: number;
  matched: number;
  updatedStock: number;
  updatedPrice: number;
  updatedName: number;
  updatedMedia: number;
  unchanged: number;
  missingInDb: number;
  missingSkus: string[];
  missingInArmsoft: number;
  missingVariantSkus: string[];
  pricelistType: string;
  amdToUsdRate: number;
  pricesFetched: number;
}

/** @deprecated Use ArmsoftStockSyncResult */
export type ArmsoftCatalogSyncResult = ArmsoftStockSyncResult;
