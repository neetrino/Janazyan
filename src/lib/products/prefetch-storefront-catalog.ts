import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { DEFAULT_CATALOG_PAGE_SIZE } from './catalog-page.constants';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCacheEntry,
  writeCatalogClientCache,
} from './catalog-client-cache';
import { fetchStorefrontCatalog } from './fetch-storefront-catalog';

const DEFAULT_CATALOG_PARSED = {
  page: 1,
  perPage: DEFAULT_CATALOG_PAGE_SIZE,
  search: undefined,
  category: undefined,
} as const;

type PrefetchDefaultStorefrontCatalogOptions = {
  /** Bypass client cache — used after language changes. */
  force?: boolean;
};

/** Client-side prefetch — hits /api/v1/storefront/catalog and stores in sessionStorage. */
export async function prefetchDefaultStorefrontCatalog(
  lang: LanguageCode,
  options: PrefetchDefaultStorefrontCatalogOptions = {},
): Promise<ProductsCatalogCacheResponse | null> {
  const cacheKey = buildCatalogClientCacheKey(DEFAULT_CATALOG_PARSED, lang);

  if (!options.force) {
    const cached = readCatalogClientCacheEntry(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const catalog = await fetchStorefrontCatalog(DEFAULT_CATALOG_PARSED, lang);
    writeCatalogClientCache(cacheKey, catalog);
    return catalog;
  } catch {
    return null;
  }
}
