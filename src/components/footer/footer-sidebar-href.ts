import { buildCatalogHrefWithPreservedParams } from '@/lib/products/preserved-catalog-query-params';

/** Footer sidebar href — keeps search, apiKey, partnerSlug, and related catalog params. */
export function buildFooterSidebarHref(
  href: string,
  currentParams: URLSearchParams,
): string {
  return buildCatalogHrefWithPreservedParams(href, currentParams);
}
