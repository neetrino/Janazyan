import {
  ARMSOFT_PRODUCTS_MAX_PAGES,
  ARMSOFT_PRODUCTS_PAGE_SIZE,
  ARMSOFT_REMAINDERS_MAX_PAGES,
  ARMSOFT_REMAINDERS_PAGE_SIZE,
} from "./constants";
import { getArmsoftSmConfig } from "./config";
import { normalizeSku } from "./sku-normalize";
import type {
  ArmsoftProductDirectoryRow,
  ArmsoftProductRemainderRow,
  ArmsoftProductsOutputDocument,
  ArmsoftProductsPage,
  ArmsoftRemaindersPage,
  ArmsoftSalePriceRow,
} from "./types";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const rawBody = await response.text();
  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw {
      status: 502,
      type: "https://api.shop.am/problems/armsoft-error",
      title: "ArmSoft communication error",
      detail: "ArmSoft returned a non-JSON response",
    };
  }
}

function isPagedResponse(
  value: unknown,
): value is { id: string; hasMore: boolean; data?: unknown } {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.hasMore === "boolean";
}

function armsoftRequestError(title: string, detail: string): never {
  throw {
    status: 502,
    type: "https://api.shop.am/problems/armsoft-error",
    title,
    detail,
  };
}

async function postArmsoftJson(
  path: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const config = getArmsoftSmConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      apiKey: config.apiKey,
      "Accept-Language": config.acceptLanguage,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const parsed = await parseJsonBody(response);

  if (!response.ok) {
    const detailFromBody =
      parsed &&
      typeof parsed === "object" &&
      "Error" in parsed &&
      typeof (parsed as { Error?: unknown }).Error === "string"
        ? String((parsed as { Error: string }).Error)
        : `ArmSoft responded with HTTP ${response.status}`;
    armsoftRequestError("ArmSoft request failed", detailFromBody);
  }

  return parsed;
}

async function fetchPagedRows<T>(
  firstPath: string,
  firstBody: Record<string, unknown>,
  nextPath: string,
  maxPages: number,
  title: string,
): Promise<T[]> {
  const rows: T[] = [];
  const firstPageRaw = await postArmsoftJson(firstPath, firstBody);

  if (!isPagedResponse(firstPageRaw)) {
    armsoftRequestError(title, "Unexpected paged response shape");
  }

  const firstPage = firstPageRaw as ArmsoftRemaindersPage | ArmsoftProductsPage;
  if (firstPage.data?.length) {
    rows.push(...(firstPage.data as T[]));
  }

  let pageId = firstPage.id;
  let hasMore = firstPage.hasMore;
  let pageCount = 1;

  while (hasMore && pageCount < maxPages) {
    const nextRaw = await postArmsoftJson(nextPath, {
      id: pageId,
      close: false,
    });

    if (!isPagedResponse(nextRaw)) {
      armsoftRequestError(title, "Unexpected next-page response shape");
    }

    const nextPage = nextRaw as ArmsoftRemaindersPage | ArmsoftProductsPage;
    if (nextPage.data?.length) {
      rows.push(...(nextPage.data as T[]));
    }

    pageId = nextPage.id;
    hasMore = nextPage.hasMore;
    pageCount += 1;
  }

  if (hasMore) {
    await postArmsoftJson(nextPath, { id: pageId, close: true }).catch(
      () => undefined,
    );
    armsoftRequestError(title, `Pagination exceeded ${maxPages} pages`);
  }

  return rows;
}

/**
 * Fetches all product remainder rows (paginated) for the given date.
 */
export async function fetchAllProductRemainders(
  dateIso: string = todayIsoDate(),
): Promise<ArmsoftProductRemainderRow[]> {
  const config = getArmsoftSmConfig();
  return fetchPagedRows<ArmsoftProductRemainderRow>(
    "/v1/reports/productremainders",
    {
      pageSize: ARMSOFT_REMAINDERS_PAGE_SIZE,
      date: dateIso,
      storage: config.storageFilter,
      pricelistType: config.pricelistType,
      showAlsoAdditionalUnitQuantities: false,
      showZeroRows: true,
    },
    "/v1/reports/productremainders/nextpage",
    ARMSOFT_REMAINDERS_MAX_PAGES,
    "ArmSoft remainders error",
  );
}

/**
 * Fetches product directory rows (code ↔ inner id mapping for price list).
 */
export async function fetchAllProducts(): Promise<ArmsoftProductDirectoryRow[]> {
  return fetchPagedRows<ArmsoftProductDirectoryRow>(
    "/v1/directories/products",
    {
      pageSize: ARMSOFT_PRODUCTS_PAGE_SIZE,
      showAlsoClosed: false,
    },
    "/v1/directories/products/nextpage",
    ARMSOFT_PRODUCTS_MAX_PAGES,
    "ArmSoft products directory error",
  );
}

export function extractArmsoftProductImageUrl(
  product: ArmsoftProductDirectoryRow,
): string | null {
  const candidates = [
    product.imageUrl,
    product.photoUrl,
    product.pictureUrl,
    product.externalCode,
  ];

  for (const value of candidates) {
    const url = String(value ?? "").trim();
    if (!url) {
      continue;
    }
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
  }

  return null;
}

function isSalePriceRow(value: unknown): value is ArmsoftSalePriceRow {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.productId === "number" && typeof record.salePrice === "number"
  );
}

/**
 * Fetches sale prices (AMD) for product codes via pricelist calculation API.
 * Remainders report does not return price columns in SM Public API.
 */
export async function fetchSalePricesBySku(
  productCodes: string[],
  dateIso: string = todayIsoDate(),
  productsDirectoryRows?: ArmsoftProductDirectoryRow[],
): Promise<Map<string, number>> {
  const config = getArmsoftSmConfig();
  const codes = [
    ...new Set(
      productCodes
        .map((code) => normalizeSku(code))
        .filter((code) => code.length > 0),
    ),
  ];
  const bySku = new Map<string, number>();

  if (codes.length === 0) {
    return bySku;
  }

  const products = productsDirectoryRows ?? (await fetchAllProducts());
  const idToCode = new Map<number, string>();
  for (const product of products) {
    const code = normalizeSku(String(product.code ?? ""));
    if (code && Number.isFinite(product.id)) {
      idToCode.set(product.id, code);
    }
  }

  const raw = await postArmsoftJson(
    "/v1/calculation/productssalepricesfrompricelist",
    {
      pricelistType: config.pricelistType,
      date: dateIso,
      products: codes,
      includeAllProducts: false,
    },
  );

  if (!Array.isArray(raw)) {
    armsoftRequestError(
      "ArmSoft prices error",
      "Unexpected sale-prices response shape",
    );
  }

  for (const row of raw) {
    if (!isSalePriceRow(row)) {
      continue;
    }
    const sku = idToCode.get(row.productId);
    if (!sku || !(row.salePrice > 0)) {
      continue;
    }
    bySku.set(sku, row.salePrice);
  }

  return bySku;
}

/**
 * Creates a ProductsOutput (warehouse stock-out) document in ArmSoft SM.
 * Requires API key permission for documents write.
 */
export async function createProductsOutputDocument(
  document: ArmsoftProductsOutputDocument,
): Promise<ArmsoftProductsOutputDocument> {
  const raw = await postArmsoftJson(
    "/v1/documents/productsoutput",
    document as unknown as Record<string, unknown>,
  );

  if (!raw || typeof raw !== "object") {
    armsoftRequestError(
      "ArmSoft productsoutput error",
      "Unexpected productsoutput response shape",
    );
  }

  return raw as ArmsoftProductsOutputDocument;
}

export const armsoftClient = {
  fetchAllProductRemainders,
  fetchAllProducts,
  fetchSalePricesBySku,
  createProductsOutputDocument,
};
