import { existsSync } from 'fs';
import path from 'path';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';

const LOCAL_PRODUCT_MEDIA_PREFIX = '/product-media/';

function localPublicFileExists(publicPath: string): boolean {
  if (!publicPath.startsWith('/')) {
    return false;
  }

  const filePath = path.join(process.cwd(), 'public', publicPath.slice(1));
  return existsSync(filePath);
}

/**
 * Sync validation for stored product image references.
 * Drops missing local `/product-media/*` paths before they reach the browser.
 */
export function sanitizeStoredProductImageUrl(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) {
    return null;
  }

  const firstUrl = smartSplitUrls(value)[0];
  const processed = processImageUrl(firstUrl);
  if (!processed) {
    return null;
  }

  if (
    processed.startsWith('http://') ||
    processed.startsWith('https://') ||
    processed.startsWith('data:image/')
  ) {
    return processed;
  }

  if (processed.startsWith(LOCAL_PRODUCT_MEDIA_PREFIX)) {
    return localPublicFileExists(processed) ? processed : null;
  }

  return processed;
}

/** Async alias — same behavior as sync validation for local public assets. */
export async function resolveStoredProductImageUrl(
  value: string | null | undefined,
): Promise<string | null> {
  return sanitizeStoredProductImageUrl(value);
}
