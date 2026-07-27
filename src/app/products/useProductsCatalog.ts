'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MutableRefObject,
} from 'react';
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
  /** SSR payload — used only while it matches the current filter key. */
  initialCatalog?: ProductsCatalogCacheResponse | null;
};

function catalogsMatchCurrentKey(
  initialCatalog: ProductsCatalogCacheResponse | null,
  cacheKey: string,
  initialKeyRef: MutableRefObject<string | null>,
  prevInitialRef: MutableRefObject<ProductsCatalogCacheResponse | null>,
): ProductsCatalogCacheResponse | null {
  if (!initialCatalog) {
    return null;
  }

  if (initialCatalog !== prevInitialRef.current) {
    initialKeyRef.current = cacheKey;
    prevInitialRef.current = initialCatalog;
  }

  if (initialKeyRef.current !== cacheKey) {
    return null;
  }

  return initialCatalog;
}

export function useProductsCatalog(
  parsed: ParsedCatalogParams,
  language: LanguageCode,
  options?: UseProductsCatalogOptions,
): UseProductsCatalogResult {
  const initialCatalogProp = options?.initialCatalog ?? null;
  const cacheKey = buildCatalogClientCacheKey(parsed, language);
  const initialKeyRef = useRef<string | null>(null);
  const prevInitialRef = useRef<ProductsCatalogCacheResponse | null>(null);

  const matchingInitial = catalogsMatchCurrentKey(
    initialCatalogProp,
    cacheKey,
    initialKeyRef,
    prevInitialRef,
  );

  const cached = useSyncExternalStore(
    subscribeCatalogClientCache,
    () => matchingInitial ?? readCatalogClientCacheEntry(cacheKey),
    () => matchingInitial,
  );

  const [meta, setMeta] = useState<ProductsCatalogCacheResponse['meta'] | null>(
    matchingInitial?.meta ?? cached?.meta ?? null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(!matchingInitial && !cached);

  useEffect(() => {
    if (matchingInitial) {
      writeCatalogClientCache(cacheKey, matchingInitial);
      setMeta(matchingInitial.meta);
      setError(null);
      setIsFetching(false);
      return;
    }

    const existing = readCatalogClientCacheEntry(cacheKey);
    if (existing) {
      setMeta(existing.meta);
      setError(null);
      setIsFetching(false);
      return;
    }

    let cancelled = false;
    setError(null);
    setIsFetching(true);

    void fetchStorefrontCatalog(
      {
        page: parsed.page,
        perPage: parsed.perPage,
        search: parsed.search,
        category: parsed.category,
      },
      language,
    )
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
  }, [
    cacheKey,
    language,
    matchingInitial,
    parsed.page,
    parsed.perPage,
    parsed.search,
    parsed.category,
  ]);

  const catalogData = matchingInitial ?? cached ?? readCatalogClientCacheEntry(cacheKey);

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
