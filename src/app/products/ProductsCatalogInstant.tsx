'use client';

import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import type { ParsedCatalogParams, SearchParamsInput } from '@/lib/products/catalog-search-params';
import { useProductsCatalog } from './useProductsCatalog';
import { ProductsCatalogView } from './ProductsCatalogView';

type ProductsCatalogInstantProps = {
  parsed: ParsedCatalogParams;
  raw: SearchParamsInput;
  language: LanguageCode;
  /** Server-fetched catalog — rendered in initial HTML without client waterfall. */
  initialCatalog?: ProductsCatalogCacheResponse | null;
};

/**
 * Catalog client view — paints SSR data immediately; client fetch only as fallback.
 */
export function ProductsCatalogInstant({
  parsed,
  raw,
  language,
  initialCatalog = null,
}: ProductsCatalogInstantProps) {
  const { products, meta, isLoading, error } = useProductsCatalog(parsed, language, {
    initialCatalog,
  });

  return (
    <ProductsCatalogView
      parsed={parsed}
      raw={raw}
      products={products}
      meta={meta}
      isLoading={isLoading}
      error={error}
    />
  );
}
