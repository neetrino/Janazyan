import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { DEFAULT_CATALOG_PAGE_SIZE } from './catalog-page.constants';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCacheEntry,
  writeCatalogClientCache,
} from './catalog-client-cache';
import { fetchStorefrontCatalog } from './fetch-storefront-catalog';

type PrefetchCategoryCatalogOptions = {
  page?: number;
  perPage?: number;
  force?: boolean;
};

/**
 * Warm client catalog cache for a shop category filter (or all products when omitted).
 */
export async function prefetchCategoryCatalog(
  lang: LanguageCode,
  category?: string,
  options: PrefetchCategoryCatalogOptions = {},
): Promise<ProductsCatalogCacheResponse | null> {
  const parsed = {
    page: options.page ?? 1,
    perPage: options.perPage ?? DEFAULT_CATALOG_PAGE_SIZE,
    search: undefined as string | undefined,
    category: category?.trim() || undefined,
  };
  const cacheKey = buildCatalogClientCacheKey(parsed, lang);

  if (!options.force) {
    const cached = readCatalogClientCacheEntry(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const catalog = await fetchStorefrontCatalog(parsed, lang);
    writeCatalogClientCache(cacheKey, catalog);
    return catalog;
  } catch {
    return null;
  }
}
