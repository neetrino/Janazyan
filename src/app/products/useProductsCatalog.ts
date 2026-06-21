'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCacheEntry,
  subscribeCatalogClientCache,
  writeCatalogClientCache,
} from '@/lib/products/catalog-client-cache';
import { fetchStorefrontCatalog } from '@/lib/products/fetch-storefront-catalog';
import { normalizeCatalogProducts, type CatalogGridProduct } from '@/lib/products/normalize-catalog-products';
import type { ParsedCatalogParams } from '@/lib/products/catalog-search-params';

type UseProductsCatalogResult = {
  products: CatalogGridProduct[];
  meta: ProductsCatalogCacheResponse['meta'] | null;
  isLoading: boolean;
  error: Error | null;
};

type UseProductsCatalogOptions = {
  /** SSR payload — skips client fetch on mount when present. */
  initialCatalog?: ProductsCatalogCacheResponse | null;
};

export function useProductsCatalog(
  parsed: ParsedCatalogParams,
  language: LanguageCode,
  options?: UseProductsCatalogOptions,
): UseProductsCatalogResult {
  const initialCatalog = options?.initialCatalog ?? null;
  const cacheKey = buildCatalogClientCacheKey(parsed, language);

  const cached = useSyncExternalStore(
    subscribeCatalogClientCache,
    () => initialCatalog ?? readCatalogClientCacheEntry(cacheKey),
    () => initialCatalog,
  );

  const [meta, setMeta] = useState<ProductsCatalogCacheResponse['meta'] | null>(
    initialCatalog?.meta ?? cached?.meta ?? null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(!initialCatalog && !cached);

  useEffect(() => {
    if (initialCatalog) {
      writeCatalogClientCache(cacheKey, initialCatalog);
      setMeta(initialCatalog.meta);
      setError(null);
      setIsFetching(false);
      return;
    }

    let cancelled = false;
    setError(null);
    setIsFetching(true);

    void fetchStorefrontCatalog(parsed, language)
      .then((response) => {
        if (cancelled) {
          return;
        }

        writeCatalogClientCache(cacheKey, response);
        setMeta(response.meta);
        setIsFetching(false);
      })
      .catch((fetchError: unknown) => {
        if (cancelled) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError : new Error('Catalog fetch failed'));
        setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, initialCatalog, language, parsed.category, parsed.page, parsed.perPage, parsed.search]);

  const catalogData = initialCatalog ?? cached;

  const products = useMemo(
    () => (catalogData ? normalizeCatalogProducts(catalogData, parsed.sort) : []),
    [catalogData, parsed.sort],
  );

  return {
    products,
    meta: meta ?? catalogData?.meta ?? null,
    isLoading: !catalogData && isFetching,
    error,
  };
}
