import { PRODUCTS_CATALOG_PAGINATION_BOUNDARY_PAGE_COUNT } from '@/app/products/products-catalog-pagination.constants';

export type CatalogPaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis' };

const MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS = 7;

/**
 * Builds storefront catalog page items to match Figma Pagination (V2):
 * e.g. 1, 2, 3, …, 10 on early pages.
 */
export function buildCatalogPaginationItems(
  currentPage: number,
  totalPages: number,
): CatalogPaginationItem[] {
  if (totalPages <= MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: 'page',
      page: index + 1,
    }));
  }

  const boundaryCount = PRODUCTS_CATALOG_PAGINATION_BOUNDARY_PAGE_COUNT;

  if (currentPage <= boundaryCount) {
    return [
      ...createPageRange(1, boundaryCount),
      { type: 'ellipsis' },
      { type: 'page', page: totalPages },
    ];
  }

  if (currentPage > totalPages - boundaryCount) {
    return [
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      ...createPageRange(totalPages - boundaryCount + 1, totalPages),
    ];
  }

  return [
    { type: 'page', page: 1 },
    { type: 'ellipsis' },
    ...createPageRange(currentPage - 1, currentPage + 1),
    { type: 'ellipsis' },
    { type: 'page', page: totalPages },
  ];
}

function createPageRange(start: number, end: number): CatalogPaginationItem[] {
  const items: CatalogPaginationItem[] = [];

  for (let page = start; page <= end; page += 1) {
    items.push({ type: 'page', page });
  }

  return items;
}
