import 'server-only';

import { revalidateTag } from 'next/cache';
import { cacheService } from '@/lib/services/cache.service';
import { STOREFRONT_CACHE_KEYS } from './storefront-cache.constants';
import { deleteJsonCachePattern } from './storefront-cache-io';

async function clearProductPageRedisPatterns(): Promise<void> {
  await Promise.all([
    deleteJsonCachePattern('product:visual:*'),
    deleteJsonCachePattern('product:ref:*'),
    deleteJsonCachePattern('product:details:*'),
    deleteJsonCachePattern('product:related:*'),
    deleteJsonCachePattern('product:reviews:*'),
  ]);
}

/** After category create/update/delete (admin). */
export async function invalidateStorefrontCategoryCaches(): Promise<void> {
  // @ts-expect-error - revalidateTag type issue in Next.js
  revalidateTag('categories');
  await Promise.all([
    cacheService.deletePattern('categories:tree:*'),
    cacheService.deletePattern('categories:navigation-previews:*'),
    cacheService.deletePattern('categories:slug:*'),
    cacheService.deletePattern('categories:top:*'),
    cacheService.deletePattern('categories:nav-strip:*'),
  ]);
}

/** Filters derived from product rows. */
export async function invalidateStorefrontProductFilterCaches(): Promise<void> {
  await cacheService.deletePattern('products:filters:*');
}

export async function invalidateCurrencyRatesCache(): Promise<void> {
  await cacheService.del(STOREFRONT_CACHE_KEYS.currencyRates());
}

/** Call when products change — clears nav previews and filter aggregates. */
export async function invalidateStorefrontProductRelatedCaches(): Promise<void> {
  await Promise.all([
    cacheService.deletePattern('categories:navigation-previews:*'),
    invalidateStorefrontProductFilterCaches(),
  ]);
}

/** Admin settings (discounts, currency, etc.) affect public product payloads and rates. */
export async function invalidateStorefrontAfterAdminSettingsUpdate(): Promise<void> {
  await invalidateCurrencyRatesCache();
  await cacheService.deletePattern('products:*');
  await clearProductPageRedisPatterns();
  await cacheService.deletePattern('cart:view:v1:*');
  await invalidateStorefrontProductRelatedCaches();
}

/** Invalidate split PDP caches (visual / ref / details / related / reviews). */
export async function invalidateProductPageCaches(): Promise<void> {
  await clearProductPageRedisPatterns();
}

/** After review create/update/delete — clears published review lists for PDP/API. */
export async function invalidateProductReviewsCaches(): Promise<void> {
  // @ts-expect-error - revalidateTag type issue in Next.js
  revalidateTag('reviews');
  await deleteJsonCachePattern('product:reviews:*');
}

/** After blog post create/update/delete (admin). */
export async function invalidateBlogCaches(): Promise<void> {
  await Promise.all([
    cacheService.deletePattern('blog:posts:*'),
    cacheService.deletePattern('blog:post:*'),
  ]);
}

/** After FAQ category/item mutations (admin). */
export async function invalidateFaqCaches(): Promise<void> {
  await cacheService.deletePattern('faq:published:*');
}

/** After partner store create/update/delete (admin). */
export async function invalidatePartnerStoresCaches(): Promise<void> {
  await cacheService.deletePattern('partner-stores:*');
  await cacheService.deletePattern('partner-stores:v2:*');
}
