import { STOREFRONT_HORIZONTAL_GUTTER_CLASS } from './storefront-layout.constants';

/** Safe-area + breathing room below status bar. */
export const STOREFRONT_MOBILE_TOP_INSET_CLASS = 'pt-10';

/**
 * MobileBottomNav outer chrome + icon row + labels (see MobileBottomNav).
 * Keeps scrollable content above the fixed bar without a layout-level white strip.
 */
export const STOREFRONT_MOBILE_BOTTOM_NAV_HEIGHT_PX = 88;

/** Padding above fixed bottom nav — includes home-indicator safe area. */
export const STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS =
  'pb-[calc(88px+env(safe-area-inset-bottom,0px))]';

/** White content card — rounded top matches home backdrop curve. */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS =
  `relative z-10 mt-6 rounded-t-[44px] bg-white pt-6 ${STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

/** Gap between search row and optional page toolbar (breadcrumb, pills). */
export const STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS = 'mt-5';

/** Home mobile sky→pink section — content spacing + bottom nav clearance. */
export const HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS =
  'pb-[calc(120px+env(safe-area-inset-bottom,0px))]';

/** Outer mobile shell — gradient backdrop + horizontal gutter. */
export const STOREFRONT_MOBILE_SHELL_CLASS = `relative lg:hidden ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`;
