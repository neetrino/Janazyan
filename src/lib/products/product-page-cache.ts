import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { productsSlugService } from '@/lib/services/products-slug.service';
import { reviewsService } from '@/lib/services/reviews.service';
import type { Product } from '@/app/products/[slug]/types';
import type { Review } from '@/components/ProductReviews/utils';

export const PRODUCT_PAGE_REVALIDATE_SECONDS = 300;

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      Number((error as { status: number }).status) === 404,
  );
}

async function loadProductDetails(slug: string, lang: string): Promise<Product | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productDetails(lang, slug);
  const cached = await readJsonCache<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    let body: Product;
    try {
      body = (await productsSlugService.findBySlug(slug, lang)) as Product;
    } catch (first: unknown) {
      if (isNotFoundError(first) && lang !== 'en') {
        body = (await productsSlugService.findBySlug(slug, 'en')) as Product;
      } else {
        throw first;
      }
    }
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, body);
    return body;
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

const getCachedProductDetails = unstable_cache(
  async (slug: string, lang: string): Promise<Product | null> => loadProductDetails(slug, lang),
  ['product-page-details-v2'],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ['products'] },
);

/** Same-request dedup (layout metadata + page render). */
export const fetchProductPageProduct = cache(
  async (slug: string, lang: string): Promise<Product | null> => getCachedProductDetails(slug, lang),
);

export const fetchProductPageReviews = cache(
  async (productId: string): Promise<Review[]> => {
    try {
      const rows = await reviewsService.getProductReviews(productId, { publishedOnly: true });
      return rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        userName: row.userName,
        rating: row.rating,
        comment: row.comment,
        createdAt: row.createdAt,
      }));
    } catch {
      return [];
    }
  },
);
