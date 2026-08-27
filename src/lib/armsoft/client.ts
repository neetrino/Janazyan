import {
  ARMSOFT_REMAINDERS_MAX_PAGES,
  ARMSOFT_REMAINDERS_PAGE_SIZE,
} from "./constants";
import { getArmsoftSmConfig } from "./config";
import type { ArmsoftProductRemainderRow, ArmsoftRemaindersPage } from "./types";

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

function isRemaindersPage(value: unknown): value is ArmsoftRemaindersPage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.hasMore === "boolean";
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
    throw {
      status: 502,
      type: "https://api.shop.am/problems/armsoft-error",
      title: "ArmSoft request failed",
      detail: `ArmSoft responded with HTTP ${response.status}`,
    };
  }

  return parsed;
}

/**
 * Fetches all product remainder rows (paginated) for the given date.
 */
export async function fetchAllProductRemainders(
  dateIso: string = todayIsoDate(),
): Promise<ArmsoftProductRemainderRow[]> {
  const config = getArmsoftSmConfig();
  const rows: ArmsoftProductRemainderRow[] = [];

  const firstPageRaw = await postArmsoftJson("/v1/reports/productremainders", {
    pageSize: ARMSOFT_REMAINDERS_PAGE_SIZE,
    date: dateIso,
    storage: config.storageFilter,
    pricelistType: config.pricelistType,
    showAlsoAdditionalUnitQuantities: false,
    showZeroRows: true,
  });

  if (!isRemaindersPage(firstPageRaw)) {
    throw {
      status: 502,
      type: "https://api.shop.am/problems/armsoft-error",
      title: "ArmSoft remainders error",
      detail: "Unexpected remainders response shape",
    };
  }

  if (firstPageRaw.data?.length) {
    rows.push(...firstPageRaw.data);
  }

  let pageId = firstPageRaw.id;
  let hasMore = firstPageRaw.hasMore;
  let pageCount = 1;

  while (hasMore && pageCount < ARMSOFT_REMAINDERS_MAX_PAGES) {
    const nextRaw = await postArmsoftJson(
      "/v1/reports/productremainders/nextpage",
      { id: pageId, close: false },
    );

    if (!isRemaindersPage(nextRaw)) {
      throw {
        status: 502,
        type: "https://api.shop.am/problems/armsoft-error",
        title: "ArmSoft remainders error",
        detail: "Unexpected next-page response shape",
      };
    }

    if (nextRaw.data?.length) {
      rows.push(...nextRaw.data);
    }

    pageId = nextRaw.id;
    hasMore = nextRaw.hasMore;
    pageCount += 1;
  }

  if (hasMore) {
    await postArmsoftJson("/v1/reports/productremainders/nextpage", {
      id: pageId,
      close: true,
    }).catch(() => undefined);

    throw {
      status: 502,
      type: "https://api.shop.am/problems/armsoft-error",
      title: "ArmSoft remainders error",
      detail: `Remainders pagination exceeded ${ARMSOFT_REMAINDERS_MAX_PAGES} pages`,
    };
  }

  return rows;
}

export const armsoftClient = {
  fetchAllProductRemainders,
};
