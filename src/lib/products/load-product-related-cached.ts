import 'server-only';

import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import { findRelatedByProductSlug } from '@/lib/services/products-slug/product-related.service';

type RelatedResponse = Awaited<ReturnType<typeof findRelatedByProductSlug>>;

async function persistRelatedProducts(
  slug: string,
  lang: string,
  cacheKey: string,
): Promise<RelatedResponse> {
  const cachedAfterLock = await readJsonCache<RelatedResponse>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  const body = await findRelatedByProductSlug(slug, lang);
  await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productRelated, body);
  return body;
}

export async function getProductRelatedCached(
  slug: string,
  lang: string,
): Promise<RelatedResponse> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productRelated(lang, slug);
  const cached = await readJsonCache<RelatedResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-related:${cacheKey}`, () =>
    persistRelatedProducts(slug, lang, cacheKey),
  );
}
