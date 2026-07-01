export const R2_NOT_CONFIGURED_DETAIL =
  'R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in .env.';

export type R2ConfigError = {
  status: number;
  type: string;
  title: string;
  detail: string;
};

/** Returns the trimmed R2 public base URL or null when unset. */
export function getR2PublicUrl(): string | null {
  const url = process.env.R2_PUBLIC_URL?.trim();
  return url || null;
}

/** True when all R2 credentials and the public URL are present. */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim() &&
      getR2PublicUrl(),
  );
}

/** Throws a structured API error when R2 is not configured. */
export function assertR2Configured(): void {
  if (!isR2Configured()) {
    throw {
      status: 503,
      type: 'https://api.shop.am/problems/config-error',
      title: 'Storage not configured',
      detail: R2_NOT_CONFIGURED_DETAIL,
    } satisfies R2ConfigError;
  }
}
