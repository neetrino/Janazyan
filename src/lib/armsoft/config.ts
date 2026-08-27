import { ARMSOFT_SM_DEFAULT_BASE_URL } from "./constants";

export interface ArmsoftSmConfig {
  baseUrl: string;
  apiKey: string;
  /** When set, only this warehouse code is included in stock totals. */
  storageFilter: string | null;
  acceptLanguage: string;
  /** Price list type for remainders price field (e.g. "01"). */
  pricelistType: string;
}

function toTrimmed(value?: string): string {
  return value?.trim() ?? "";
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

/**
 * Reads ArmSoft SalesManagement credentials from env.
 * @throws Problem-details-shaped object when API key is missing.
 */
export function getArmsoftSmConfig(): ArmsoftSmConfig {
  const apiKey = toTrimmed(process.env.ARMSOFT_SM_API_KEY);
  if (!apiKey) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/configuration-error",
      title: "ArmSoft configuration error",
      detail: "ARMSOFT_SM_API_KEY is missing in environment variables",
    };
  }

  const baseUrl =
    normalizeBaseUrl(toTrimmed(process.env.ARMSOFT_SM_BASE_URL)) ||
    ARMSOFT_SM_DEFAULT_BASE_URL;
  const storageFilter = toTrimmed(process.env.ARMSOFT_SM_STORAGE) || null;
  const acceptLanguage =
    toTrimmed(process.env.ARMSOFT_SM_ACCEPT_LANGUAGE) || "hy-AM";
  const pricelistType =
    toTrimmed(process.env.ARMSOFT_SM_PRICELIST_TYPE) || "01";

  return {
    baseUrl,
    apiKey,
    storageFilter,
    acceptLanguage,
    pricelistType,
  };
}
