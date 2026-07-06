/** Default page size for /products grid (must match catalog-search-params default). */
export const DEFAULT_CATALOG_PAGE_SIZE = 12;

/** Eager image load for first visible row (2 cols mobile, 4 cols desktop). */
export const CATALOG_PRIORITY_CARD_COUNT = 4;

/** Default product grid layout on /products (2 cols mobile, 3 tablet, 4 desktop). */
export const PRODUCTS_CATALOG_GRID_CLASS =
  'grid w-full grid-cols-2 justify-items-center gap-x-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 desktop:grid-cols-4 desktop:gap-x-6 desktop:gap-y-10';
