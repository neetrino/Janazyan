import 'server-only';

import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import { productsService } from '@/lib/services/products.service';
import { fetchProductAverageRatings } from '@/lib/products/fetch-product-average-ratings';
import {
  readJsonCache,
  writeJsonCache,
} from './storefront-cache-io';
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
} from './storefront-cache.constants';
import { cacheService } from '../services/cache.service';
import { logger } from '../utils/logger';
import { dedupeInFlight } from './in-flight-dedup';
import {
  buildProductsCatalogCacheKey,
  type ProductsCatalogCacheFilters,
  type ProductsCatalogCacheResponse,
} from './products-catalog-cache.types';

export type { ProductsCatalogCacheFilters, ProductsCatalogCacheResponse };
export { buildProductsCatalogCacheKey };

const EMPTY_CATALOG: ProductsCatalogCacheResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
};

export async function getProductsCatalogFromRedisOrDb(
  filters: ProductsCatalogCacheFilters,
): Promise<ProductsCatalogCacheResponse> {
  const key = STOREFRONT_CACHE_KEYS.productsCatalog(buildProductsCatalogCacheKey(filters));
  const cached = await readJsonCache<ProductsCatalogCacheResponse>(key);
  if (cached) {
    logger.debug('[PRODUCTS CATALOG CACHE] hit', {
      provider: cacheService.isAvailable() ? 'redis' : 'memory',
      page: filters.page,
      limit: filters.limit,
      lang: filters.lang,
      hasSearch: Boolean(filters.search?.trim()),
      hasCategory: Boolean(filters.category?.trim()),
    });
    return cached;
  }

  logger.debug('[PRODUCTS CATALOG CACHE] miss', {
    provider: cacheService.isAvailable() ? 'redis' : 'memory',
    page: filters.page,
    limit: filters.limit,
    lang: filters.lang,
    hasSearch: Boolean(filters.search?.trim()),
    hasCategory: Boolean(filters.category?.trim()),
  });

  return dedupeInFlight(`products-catalog:${key}`, () =>
    loadProductsCatalogFromDbAndCache(filters, key),
  );
}

async function loadProductsCatalogFromDbAndCache(
  filters: ProductsCatalogCacheFilters,
  cacheKey: string,
): Promise<ProductsCatalogCacheResponse> {
  const cachedAfterLock = await readJsonCache<ProductsCatalogCacheResponse>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  if (!isDatabaseConnectionUrlConfigured()) {
    return EMPTY_CATALOG;
  }

  const result = await productsService.findAll({
    page: filters.page,
    limit: filters.limit,
    lang: filters.lang,
    search: filters.search?.trim() || undefined,
    category: filters.category?.trim() || undefined,
    catalog: true,
    fastCatalog: true,
  });

  const ratings = await fetchProductAverageRatings(result.data.map((product) => product.id));

  const response: ProductsCatalogCacheResponse = {
    data: result.data.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
      brand: product.brand ? { id: product.brand.id, name: product.brand.name } : null,
      defaultVariantId: product.defaultVariantId,
      colors: product.colors ?? [],
      categories: product.categories.map((category) => ({ title: category.title })),
      ratingAverage: ratings.get(product.id) ?? null,
      labels: product.labels ?? [],
    })),
    meta: result.meta,
  };

  await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productsCatalog, response);
  return response;
}
