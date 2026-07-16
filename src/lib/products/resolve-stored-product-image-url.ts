import { extractMediaUrl } from '@/lib/utils/extractMediaUrl';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';

const LOCAL_PRODUCT_MEDIA_PREFIX = '/product-media/';

function localPublicFileExists(publicPath: string): boolean {
  if (typeof window !== 'undefined' || !publicPath.startsWith('/')) {
    return false;
  }

  // Lazy load keeps `fs`/`path` out of the client bundle (this module is shared).
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Node-only, sync check
  const { existsSync } = require('node:fs') as typeof import('node:fs');
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Node-only, sync check
  const path = require('node:path') as typeof import('node:path');
  const filePath = path.join(process.cwd(), 'public', publicPath.slice(1));
  return existsSync(filePath);
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function isLocalDevHttpImageUrl(url: string): boolean {
  return url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1');
}

function resolveLocalProductMediaPath(processed: string): string | null {
  if (typeof window === 'undefined') {
    return localPublicFileExists(processed) ? processed : null;
  }

  return isProduction() ? null : processed;
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

  if (processed.startsWith('data:image/')) {
    return processed;
  }

  if (processed.startsWith('https://')) {
    return processed;
  }

  if (processed.startsWith('http://')) {
    if (isProduction() && isLocalDevHttpImageUrl(processed)) {
      return null;
    }
    return isProduction() ? null : processed;
  }

  if (processed.startsWith(LOCAL_PRODUCT_MEDIA_PREFIX)) {
    return resolveLocalProductMediaPath(processed);
  }

  return processed;
}

/**
 * Extracts the first product media URL and normalizes it for storefront display.
 */
export function extractSanitizedProductImageUrl(media: unknown): string | null {
  return sanitizeStoredProductImageUrl(extractMediaUrl(media));
}

/**
 * Resolves a cart/checkout line image from product media with variant fallback.
 */
export function resolveCartProductImageUrl(
  media: unknown,
  variantImageUrl?: string | null,
): string | null {
  return (
    extractSanitizedProductImageUrl(media) ??
    sanitizeStoredProductImageUrl(variantImageUrl)
  );
}

/** Async alias — same behavior as sync validation for local public assets. */
export async function resolveStoredProductImageUrl(
  value: string | null | undefined,
): Promise<string | null> {
  return sanitizeStoredProductImageUrl(value);
}
