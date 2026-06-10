import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import { productsService } from '@/lib/services/products.service';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from './storefront-cache';

export type ProductsCatalogCacheFilters = {
  page: number;
  limit: number;
  lang: string;
  search?: string;
  category?: string;
};

export type ProductsCatalogCacheResponse = {
  data: Array<{
    id: string;
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    originalPrice: number | null;
    image: string | null;
    inStock: boolean;
    brand: { id: string; name: string } | null;
    defaultVariantId: string | null;
    colors: unknown[];
    labels: Array<{
      id: string;
      type: 'text' | 'percentage';
      value: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      color: string | null;
    }>;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const EMPTY_CATALOG: ProductsCatalogCacheResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
};

export function buildProductsCatalogCacheKey(
  filters: ProductsCatalogCacheFilters,
): string {
  const search = filters.search?.trim() || '-';
  const category = filters.category?.trim() || '-';
  return `v1:${filters.lang}:${filters.page}:${filters.limit}:${category}:${search}`;
}

export async function getProductsCatalogFromRedisOrDb(
  filters: ProductsCatalogCacheFilters,
): Promise<ProductsCatalogCacheResponse> {
  const key = STOREFRONT_CACHE_KEYS.productsCatalog(buildProductsCatalogCacheKey(filters));
  const cached = await readJsonCache<ProductsCatalogCacheResponse>(key);
  if (cached) {
    return cached;
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
  });

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
      labels: product.labels ?? [],
    })),
    meta: result.meta,
  };

  await writeJsonCache(key, STOREFRONT_CACHE_TTL.productsCatalog, response);
  return response;
}
