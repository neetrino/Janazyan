import 'server-only';

import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import {
  findVisualBySlug,
  type ProductVisualPayload,
} from '@/lib/services/products-slug/product-visual.service';

async function persistProductVisual(
  slug: string,
  lang: string,
  cacheKey: string,
): Promise<ProductVisualPayload | null> {
  const cachedAfterLock = await readJsonCache<ProductVisualPayload>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  const body = await findVisualBySlug(slug, lang);
  if (!body) {
    return null;
  }

  await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productVisual, body);
  return body;
}

export async function getProductVisualCached(
  slug: string,
  lang: string,
): Promise<ProductVisualPayload | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productVisual(lang, slug);
  const cached = await readJsonCache<ProductVisualPayload>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-visual:${cacheKey}`, () =>
    persistProductVisual(slug, lang, cacheKey),
  );
}
