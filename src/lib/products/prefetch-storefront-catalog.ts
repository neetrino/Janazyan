import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { prefetchCategoryCatalog } from './prefetch-category-catalog';

type PrefetchDefaultStorefrontCatalogOptions = {
  /** Bypass client cache — used after language changes. */
  force?: boolean;
};

/** Client-side prefetch — hits /api/v1/storefront/catalog and stores in sessionStorage. */
export async function prefetchDefaultStorefrontCatalog(
  lang: LanguageCode,
  options: PrefetchDefaultStorefrontCatalogOptions = {},
): Promise<ProductsCatalogCacheResponse | null> {
  return prefetchCategoryCatalog(lang, undefined, options);
}
