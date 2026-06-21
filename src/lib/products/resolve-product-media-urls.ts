import { smartSplitUrls } from '@/lib/utils/image-utils';
import { persistProductImageFromDataUrl } from '@/lib/products/persist-product-image';

const DATA_URI_PREFIX = 'data:image/';

export function isDataUriImage(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(DATA_URI_PREFIX));
}

export function mediaArrayHasDataUri(media: unknown[] | null | undefined): boolean {
  if (!Array.isArray(media)) {
    return false;
  }

  for (const entry of media) {
    if (typeof entry === 'string' && isDataUriImage(entry)) {
      return true;
    }
    if (entry && typeof entry === 'object') {
      const record = entry as { url?: string; src?: string; value?: string };
      const url = record.url ?? record.src ?? record.value;
      if (isDataUriImage(url)) {
        return true;
      }
    }
  }

  return false;
}

export async function resolveProductImageReference(value: string): Promise<string> {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (isDataUriImage(trimmed)) {
    return persistProductImageFromDataUrl(trimmed);
  }
  return trimmed;
}

export async function resolveVariantImageUrlField(
  imageUrl: string | null | undefined,
): Promise<string | null> {
  if (!imageUrl?.trim()) {
    return null;
  }

  const parts = smartSplitUrls(imageUrl);
  const resolved = await Promise.all(parts.map((part) => resolveProductImageReference(part)));
  const filtered = resolved.filter(Boolean);
  return filtered.length > 0 ? filtered.join(',') : null;
}

export async function resolveProductMediaArray(media: unknown[]): Promise<unknown[]> {
  const result: unknown[] = [];

  for (const entry of media) {
    if (typeof entry === 'string') {
      if (!entry.trim()) {
        continue;
      }
      result.push(await resolveProductImageReference(entry));
      continue;
    }

    if (entry && typeof entry === 'object') {
      const record = entry as { url?: string; src?: string; value?: string; type?: string };
      const url = record.url ?? record.src ?? record.value;
      if (typeof url === 'string' && url.trim()) {
        result.push({
          ...record,
          url: await resolveProductImageReference(url),
        });
        continue;
      }
    }

    result.push(entry);
  }

  return result;
}
