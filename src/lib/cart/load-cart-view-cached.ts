import 'server-only';

import { readJsonCache, writeJsonCache } from '@/lib/cache/storefront-cache-io';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import {
  buildCartViewCacheKey,
  type CartViewResponse,
} from './cart-view-cache.types';

const CART_VIEW_CACHE_TTL_SECONDS = 120;

type LoadCartViewFn = (userId: string, locale: string) => Promise<CartViewResponse>;

async function persistCartView(
  userId: string,
  locale: string,
  cacheKey: string,
  loadFromDb: LoadCartViewFn,
): Promise<CartViewResponse> {
  const cachedAfterLock = await readJsonCache<CartViewResponse>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  const body = await loadFromDb(userId, locale);
  await writeJsonCache(cacheKey, CART_VIEW_CACHE_TTL_SECONDS, body);
  return body;
}

/** Redis-backed cart view with in-flight dedup (Strict Mode / parallel prefetch). */
export async function getCartViewCached(
  userId: string,
  locale: string,
  loadFromDb: LoadCartViewFn,
): Promise<CartViewResponse> {
  const cacheKey = buildCartViewCacheKey(userId, locale);
  const cached = await readJsonCache<CartViewResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`cart-view:${cacheKey}`, () =>
    persistCartView(userId, locale, cacheKey, loadFromDb),
  );
}
