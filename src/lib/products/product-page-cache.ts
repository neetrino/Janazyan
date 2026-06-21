import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getProductDetailsCached } from '@/lib/products/load-product-details-cached';
import { getProductReviewsBySlugCached } from '@/lib/products/load-product-reviews-cached';
import type { Product } from '@/app/products/[slug]/types';
import type { Review } from '@/components/ProductReviews/utils';

export const PRODUCT_PAGE_REVALIDATE_SECONDS = 300;

const getCachedProductDetails = unstable_cache(
  async (slug: string, lang: string): Promise<Product | null> =>
    getProductDetailsCached(slug, lang),
  ['product-page-details-v3'],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ['products'] },
);

const getCachedProductReviews = unstable_cache(
  async (slug: string, lang: string): Promise<Review[]> => {
    const rows = await getProductReviewsBySlugCached(slug, lang);
    return rows ?? [];
  },
  ['product-page-reviews-v1'],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ['products', 'reviews'] },
);

/** Same-request dedup (layout metadata + page render). */
export const fetchProductPageProduct = cache(
  async (slug: string, lang: string): Promise<Product | null> =>
    getCachedProductDetails(slug, lang),
);

/** Published reviews by slug — parallel-safe on PDP (no product.id dependency). */
export const fetchProductPageReviewsBySlug = cache(
  async (slug: string, lang: string): Promise<Review[]> =>
    getCachedProductReviews(slug, lang),
);
