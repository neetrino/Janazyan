'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import {
  parseCatalogSearchParams,
  type ParsedCatalogParams,
  type SearchParamsInput,
} from '@/lib/products/catalog-search-params';
import { useProductsCatalog } from './useProductsCatalog';
import { ProductsCatalogView } from './ProductsCatalogView';

type ProductsCatalogInstantProps = {
  parsed: ParsedCatalogParams;
  raw: SearchParamsInput;
  language: LanguageCode;
  /** Server-fetched catalog — rendered in initial HTML without client waterfall. */
  initialCatalog?: ProductsCatalogCacheResponse | null;
};

function searchParamsToInput(searchKey: string): SearchParamsInput {
  const raw: SearchParamsInput = {};
  new URLSearchParams(searchKey).forEach((value, key) => {
    raw[key] = value;
  });
  return raw;
}

function doesSsrMatchLive(ssr: ParsedCatalogParams, live: ParsedCatalogParams): boolean {
  return (
    ssr.page === live.page &&
    ssr.perPage === live.perPage &&
    (ssr.search ?? '') === (live.search ?? '') &&
    (ssr.category ?? '') === (live.category ?? '')
  );
}

/**
 * Catalog client view — paints SSR data immediately; follows live URL for fast filters.
 */
export function ProductsCatalogInstant({
  parsed: ssrParsed,
  raw: ssrRaw,
  language,
  initialCatalog = null,
}: ProductsCatalogInstantProps) {
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const liveRaw = useMemo(() => {
    if (!searchKey) {
      return ssrRaw;
    }
    return searchParamsToInput(searchKey);
  }, [searchKey, ssrRaw]);

  const liveParsed = useMemo(() => parseCatalogSearchParams(liveRaw), [liveRaw]);
  const ssrMatchesLive = doesSsrMatchLive(ssrParsed, liveParsed);

  const { products, meta, isLoading, error } = useProductsCatalog(liveParsed, language, {
    initialCatalog: ssrMatchesLive ? initialCatalog : null,
  });

  return (
    <ProductsCatalogView
      parsed={liveParsed}
      raw={liveRaw}
      products={products}
      meta={meta}
      isLoading={isLoading}
      error={error}
    />
  );
}
