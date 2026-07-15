import 'server-only';

import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { productsSlugService } from '@/lib/services/products-slug.service';
import type { Product } from '@/app/products/[slug]/types';

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      Number((error as { status: number }).status) === 404,
  );
}

async function loadProductFromDb(slug: string, lang: string): Promise<Product> {
  try {
    return (await productsSlugService.findBySlug(slug, lang)) as Product;
  } catch (first: unknown) {
    if (isNotFoundError(first) && lang !== DEFAULT_LANGUAGE) {
      return (await productsSlugService.findBySlug(slug, DEFAULT_LANGUAGE)) as Product;
    }
    throw first;
  }
}

async function persistProductDetails(
  slug: string,
  lang: string,
  cacheKey: string,
): Promise<Product | null> {
  const cachedAfterLock = await readJsonCache<Product>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  try {
    const body = await loadProductFromDb(slug, lang);
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, body);
    return body;
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

/**
 * Redis-backed product details with in-flight dedup and double-check before DB.
 */
export async function getProductDetailsCached(
  slug: string,
  lang: string,
): Promise<Product | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productDetails(lang, slug);
  const cached = await readJsonCache<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-details:${cacheKey}`, () =>
    persistProductDetails(slug, lang, cacheKey),
  );
}
