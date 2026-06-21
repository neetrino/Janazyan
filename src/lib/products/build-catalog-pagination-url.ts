import type { SearchParamsInput } from './catalog-search-params';

export function buildCatalogPaginationUrl(
  pageNumber: number,
  raw: SearchParamsInput,
): string {
  const query = new URLSearchParams();
  query.set('page', pageNumber.toString());
  const currentLimit = raw.limit ? String(raw.limit) : '12';
  query.set('limit', currentLimit);

  Object.entries(raw).forEach(([key, value]) => {
    if (key !== 'page' && key !== 'limit' && value && typeof value === 'string') {
      query.set(key, value);
    }
  });

  return `/products?${query.toString()}`;
}
