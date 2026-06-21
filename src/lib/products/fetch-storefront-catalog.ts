import type { LanguageCode } from '@/lib/language';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import type { ParsedCatalogParams } from './catalog-search-params';

const STOREFRONT_CATALOG_API = '/api/v1/storefront/catalog';

export function buildStorefrontCatalogApiUrl(
  parsed: Pick<ParsedCatalogParams, 'page' | 'perPage' | 'search' | 'category'>,
  lang: LanguageCode,
): string {
  const params = new URLSearchParams();
  params.set('page', String(parsed.page));
  params.set('limit', String(parsed.perPage));
  params.set('lang', lang);

  if (parsed.search?.trim()) {
    params.set('search', parsed.search.trim());
  }

  if (parsed.category?.trim()) {
    params.set('category', parsed.category.trim());
  }

  return `${STOREFRONT_CATALOG_API}?${params.toString()}`;
}

async function requestStorefrontCatalog(
  url: string,
  init?: RequestInit,
): Promise<ProductsCatalogCacheResponse> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Catalog fetch failed (${response.status})`);
  }

  return response.json() as Promise<ProductsCatalogCacheResponse>;
}

export async function fetchStorefrontCatalog(
  parsed: Pick<ParsedCatalogParams, 'page' | 'perPage' | 'search' | 'category'>,
  lang: LanguageCode,
  init?: RequestInit,
): Promise<ProductsCatalogCacheResponse> {
  const url = buildStorefrontCatalogApiUrl(parsed, lang);
  return dedupeInFlight(`storefront-catalog:${url}`, () => requestStorefrontCatalog(url, init));
}
