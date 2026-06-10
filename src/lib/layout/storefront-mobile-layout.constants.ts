import { STOREFRONT_HORIZONTAL_GUTTER_CLASS } from './storefront-layout.constants';

/** Safe-area + breathing room below status bar. */
export const STOREFRONT_MOBILE_TOP_INSET_CLASS = 'pt-10';

/** White content card — rounded top matches home backdrop curve. */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS =
  'relative z-10 mt-6 rounded-t-[44px] bg-white pb-10 pt-6';

/** Gap between search row and optional page toolbar (breadcrumb, pills). */
export const STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS = 'mt-5';

/** Home mobile sky→pink section — extends gradient below last content block. */
export const HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS = 'pb-20';

/** Outer mobile shell — gradient backdrop + horizontal gutter. Bottom nav clearance: root layout `pb-16`. */
export const STOREFRONT_MOBILE_SHELL_CLASS = `relative lg:hidden ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`;
