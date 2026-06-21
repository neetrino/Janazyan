'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-client';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCacheEntry,
  subscribeCatalogClientCache,
} from '@/lib/products/catalog-client-cache';
import { normalizeCatalogProducts } from '@/lib/products/normalize-catalog-products';
import {
  parseCatalogSearchParams,
  type SearchParamsInput,
} from '@/lib/products/catalog-search-params';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';
import { ProductsCatalogView } from './ProductsCatalogView';

function searchParamsToInput(searchKey: string): SearchParamsInput {
  const raw: SearchParamsInput = {};
  new URLSearchParams(searchKey).forEach((value, key) => {
    raw[key] = value;
  });
  return raw;
}

/**
 * During client navigation, reads warmed catalog cache before the page RSC payload arrives.
 */
export function ProductsCatalogLoadingGate() {
  const searchParams = useSearchParams();
  const { lang } = useTranslation();

  const searchKey = searchParams.toString();
  const raw = useMemo(() => searchParamsToInput(searchKey), [searchKey]);
  const parsed = useMemo(() => parseCatalogSearchParams(raw), [raw]);
  const cacheKey = buildCatalogClientCacheKey(parsed, lang);

  const cached = useSyncExternalStore(
    subscribeCatalogClientCache,
    () => readCatalogClientCacheEntry(cacheKey),
    () => null,
  );

  const products = useMemo(
    () => (cached ? normalizeCatalogProducts(cached, parsed.sort) : []),
    [cached, parsed.sort],
  );

  if (!cached) {
    return <ProductsCatalogMainSkeleton />;
  }

  return (
    <ProductsCatalogView
      parsed={parsed}
      raw={raw}
      products={products}
      meta={cached.meta}
      isLoading={false}
      error={null}
    />
  );
}
