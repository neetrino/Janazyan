import { persistPartnerStoreLogoFromDataUrl } from './persist-partner-store-logo';

/**
 * Persists a logo URL: uploads base64 data URLs to storage, passes through paths/URLs unchanged.
 */
export async function resolvePartnerStoreLogoUrl(
  logoUrl: string | null | undefined,
): Promise<string | null> {
  const trimmed = logoUrl?.trim();
  if (!trimmed) {
    return null;
  }

  if (!trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  return persistPartnerStoreLogoFromDataUrl(trimmed);
}
