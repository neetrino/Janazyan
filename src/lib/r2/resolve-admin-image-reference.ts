import { persistR2ImageFromDataUrl } from '@/lib/r2/persist-r2-image';
import type { R2ImageFolder } from '@/lib/r2/r2-image-folders';

const DATA_URI_PREFIX = 'data:image/';

export function isDataUriImage(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(DATA_URI_PREFIX));
}

/**
 * Resolves admin image references for persistence: uploads data URLs to R2,
 * passes through existing remote URLs unchanged.
 */
export async function resolveAdminImageReference(
  value: string | null | undefined,
  folder: R2ImageFolder,
): Promise<string | null> {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  if (isDataUriImage(trimmed)) {
    return persistR2ImageFromDataUrl(trimmed, folder);
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return trimmed;
}
