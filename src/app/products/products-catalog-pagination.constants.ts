import { STOREFRONT_PILL_INTERACTIVE_CLASS } from '@/lib/ui/storefront-interactive-button-classes';

/** Figma Pagination (V2) — node 570:691. */
export const PRODUCTS_CATALOG_PAGINATION_ACTIVE_BG = '#a0bbd6';
export const PRODUCTS_CATALOG_PAGINATION_INACTIVE_TEXT = '#333333';
export const PRODUCTS_CATALOG_PAGINATION_CONTROL_SIZE_PX = 40;
export const PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX = 16;
export const PRODUCTS_CATALOG_PAGINATION_GAP_PX = 5;
export const PRODUCTS_CATALOG_PAGINATION_PAGE_RADIUS_PX = 32;
export const PRODUCTS_CATALOG_PAGINATION_ELLIPSIS_RADIUS_PX = 8;
export const PRODUCTS_CATALOG_PAGINATION_BOUNDARY_PAGE_COUNT = 3;

export const PRODUCTS_CATALOG_PAGINATION_FIRST_ICON_SRC = '/figma/pagination-icon-first.svg';
export const PRODUCTS_CATALOG_PAGINATION_PREV_ICON_SRC = '/figma/pagination-icon-prev.svg';
export const PRODUCTS_CATALOG_PAGINATION_NEXT_ICON_SRC = '/figma/pagination-icon-next.svg';
export const PRODUCTS_CATALOG_PAGINATION_LAST_ICON_SRC = '/figma/pagination-icon-last.svg';

export const PRODUCTS_CATALOG_PAGINATION_NAV_CLASS =
  'mt-10 flex items-start justify-center gap-[5px]';

export const PRODUCTS_CATALOG_PAGINATION_CONTROL_CLASS =
  `flex size-10 shrink-0 items-center justify-center rounded-4xl bg-white p-2.5 ${STOREFRONT_PILL_INTERACTIVE_CLASS}`;

export const PRODUCTS_CATALOG_PAGINATION_CONTROL_DISABLED_CLASS =
  'pointer-events-none opacity-40';

export const PRODUCTS_CATALOG_PAGINATION_PAGE_BASE_CLASS =
  `flex size-10 shrink-0 items-center justify-center p-2.5 text-[13px] font-semibold leading-none ${STOREFRONT_PILL_INTERACTIVE_CLASS}`;

export const PRODUCTS_CATALOG_PAGINATION_PAGE_ACTIVE_CLASS =
  'rounded-4xl bg-[#a0bbd6] text-white';

export const PRODUCTS_CATALOG_PAGINATION_PAGE_INACTIVE_CLASS =
  'rounded-4xl bg-white text-[#333]';

export const PRODUCTS_CATALOG_PAGINATION_ELLIPSIS_CLASS =
  'flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-2.5 text-[13px] font-semibold leading-none text-[#333]';
