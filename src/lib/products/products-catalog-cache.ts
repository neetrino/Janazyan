import { unstable_cache } from 'next/cache';
import {
  getProductsCatalogFromRedisOrDb,
  type ProductsCatalogCacheResponse,
} from '@/lib/cache/products-catalog-redis-cache';

export const PRODUCTS_CATALOG_REVALIDATE_SECONDS = 120;

export function fetchProductsCatalog(
  page: number,
  limit: number,
  lang: string,
  search?: string,
  category?: string,
): Promise<ProductsCatalogCacheResponse> {
  return getCachedProductsCatalog(
    page,
    limit,
    lang,
    search?.trim() ?? '',
    category?.trim() ?? '',
  );
}

const getCachedProductsCatalog = unstable_cache(
  async (
    page: number,
    limit: number,
    lang: string,
    search: string,
    category: string,
  ): Promise<ProductsCatalogCacheResponse> =>
    getProductsCatalogFromRedisOrDb({
      page,
      limit,
      lang,
      search: search || undefined,
      category: category || undefined,
    }),
  ['products-catalog-storefront-v3'],
  { revalidate: PRODUCTS_CATALOG_REVALIDATE_SECONDS, tags: ['products'] },
);
