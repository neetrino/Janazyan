import 'server-only';

import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import { getPublishedProductRefCached } from '@/lib/products/published-product-ref.cache';
import { reviewsService } from '@/lib/services/reviews.service';
import type { Review } from '@/components/ProductReviews/utils';

function mapPublishedReviews(
  rows: Awaited<ReturnType<typeof reviewsService.getProductReviews>>,
): Review[] {
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt,
  }));
}

async function persistProductReviews(
  slug: string,
  lang: string,
  cacheKey: string,
): Promise<Review[] | null> {
  const cachedAfterLock = await readJsonCache<Review[]>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  const ref = await getPublishedProductRefCached(slug, lang);
  if (!ref) {
    return null;
  }

  try {
    const rows = await reviewsService.getProductReviews(ref.id, { publishedOnly: true });
    const reviews = mapPublishedReviews(rows);
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productReviews, reviews);
    return reviews;
  } catch {
    return [];
  }
}

/**
 * Redis-backed published reviews by product slug (shared ref cache + review query).
 * Returns `null` when the product does not exist; `[]` when it exists but has no reviews.
 */
export async function getProductReviewsBySlugCached(
  slug: string,
  lang: string,
): Promise<Review[] | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productReviews(lang, slug);
  const cached = await readJsonCache<Review[]>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-reviews:${cacheKey}`, () =>
    persistProductReviews(slug, lang, cacheKey),
  );
}
