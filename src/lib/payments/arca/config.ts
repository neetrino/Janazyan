const DEFAULT_CALLBACK_PATH = "/api/v1/payments/arca/callback";
const DEFAULT_TEST_BASE_URL = "https://ipaytest.arca.am:8445/payment/rest";
const DEFAULT_LIVE_BASE_URL = "https://ipay.arca.am/payment/rest";
const INECOBANK_BASE_URL = "https://pg.inecoecom.am/payment/rest";

export interface ArcaConfig {
  isTestMode: boolean;
  username: string;
  password: string;
  baseUrl: string;
  currency: string;
  language: string;
  force3ds2: boolean;
}

function toTrimmed(value?: string): string {
  return value?.trim() ?? "";
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function resolveAppUrl(): string {
  const appUrl = toTrimmed(process.env.APP_URL) || toTrimmed(process.env.NEXT_PUBLIC_APP_URL);
  if (!appUrl) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/configuration-error",
      title: "Payment configuration error",
      detail: "APP_URL is required for ArCa callback URL",
    };
  }

  return normalizeBaseUrl(appUrl);
}

function resolveBaseUrl(isTestMode: boolean): string {
  const testBaseUrl = toTrimmed(process.env.ARCA_TEST_BASE_URL);
  const liveBaseUrl = toTrimmed(process.env.ARCA_LIVE_BASE_URL);
  const bank = toTrimmed(process.env.ARCA_BANK).toLowerCase();

  if (isTestMode && testBaseUrl) {
    return normalizeBaseUrl(testBaseUrl);
  }
  if (!isTestMode && liveBaseUrl) {
    return normalizeBaseUrl(liveBaseUrl);
  }

  if (bank === "inecobank") {
    return INECOBANK_BASE_URL;
  }

  return isTestMode ? DEFAULT_TEST_BASE_URL : DEFAULT_LIVE_BASE_URL;
}

export function getArcaConfig(): ArcaConfig {
  const isTestMode = toTrimmed(process.env.ARCA_TEST_MODE).toLowerCase() === "true";
  const username = isTestMode
    ? toTrimmed(process.env.ARCA_USERNAME)
    : toTrimmed(process.env.ARCA_LIVE_USERNAME) || toTrimmed(process.env.ARCA_USERNAME);
  const password = isTestMode
    ? toTrimmed(process.env.ARCA_PASSWORD)
    : toTrimmed(process.env.ARCA_LIVE_PASSWORD) || toTrimmed(process.env.ARCA_PASSWORD);

  if (!username || !password) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/configuration-error",
      title: "Payment configuration error",
      detail: "ArCa credentials are missing in environment variables",
    };
  }

  return {
    isTestMode,
    username,
    password,
    baseUrl: resolveBaseUrl(isTestMode),
    currency: toTrimmed(process.env.ARCA_CURRENCY) || "051",
    language: toTrimmed(process.env.ARCA_LANGUAGE) || "en",
    force3ds2: toTrimmed(process.env.ARCA_FORCE_3DS2).toLowerCase() !== "false",
  };
}

export function buildArcaReturnUrl(orderNumber: string): string {
  const callbackPath = toTrimmed(process.env.ARCA_CALLBACK_PATH) || DEFAULT_CALLBACK_PATH;
  const appUrl = resolveAppUrl();
  const callbackUrl = new URL(callbackPath, `${appUrl}/`);
  callbackUrl.searchParams.set("order", orderNumber);
  return callbackUrl.toString();
}
