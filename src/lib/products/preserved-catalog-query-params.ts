/** Query keys kept when navigating shop/catalog links from the footer sidebar. */
export const PRESERVED_CATALOG_QUERY_KEYS = [
  'search',
  'partnerSlug',
  'apiKey',
  'cityId',
  'sort',
  'brand',
  'colors',
  'sizes',
] as const;

export type PreservedCatalogQueryKey = (typeof PRESERVED_CATALOG_QUERY_KEYS)[number];

type SearchParamsLike = Pick<URLSearchParams, 'get'> | URLSearchParams;

function readParam(source: SearchParamsLike, key: PreservedCatalogQueryKey): string | null {
  const value = source.get(key);
  if (!value?.trim()) {
    return null;
  }
  return value.trim();
}

/** Copies preserved catalog params from `source` into `target`. */
export function appendPreservedCatalogQueryParams(
  target: URLSearchParams,
  source: SearchParamsLike | null | undefined,
): URLSearchParams {
  if (!source) {
    return target;
  }

  for (const key of PRESERVED_CATALOG_QUERY_KEYS) {
    const value = readParam(source, key);
    if (value) {
      target.set(key, value);
    }
  }

  return target;
}

/** Builds a storefront href, preserving catalog query params where applicable. */
export function buildCatalogHrefWithPreservedParams(
  href: string,
  source: SearchParamsLike | null | undefined,
): string {
  if (!href.startsWith('/products')) {
    return href;
  }

  const [pathname, rawQuery = ''] = href.split('?');
  const params = appendPreservedCatalogQueryParams(
    new URLSearchParams(rawQuery),
    source,
  );
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
