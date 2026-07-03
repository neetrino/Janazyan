import {
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
  STOREFRONT_SIDE_PADDING_NEG_CLASS,
} from './storefront-layout.constants';

/** Safe-area + breathing room below status bar (home mobile). */
export const STOREFRONT_MOBILE_TOP_INSET_CLASS = 'pt-8';

/** Non-home mobile hero shell — tighter top inset than home. */
export const STOREFRONT_MOBILE_HERO_SHELL_TOP_INSET_CLASS = 'pt-2';

/**
 * MobileBottomNav outer chrome + icon row + labels (see MobileBottomNav).
 * Keeps scrollable content above the fixed bar without a layout-level white strip.
 */
export const STOREFRONT_MOBILE_BOTTOM_NAV_HEIGHT_PX = 88;

/** Padding above fixed bottom nav — includes home-indicator safe area. */
export const STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS =
  'pb-[calc(88px+env(safe-area-inset-bottom,0px))]';

/** Non-home mobile backdrop — white curve starts below top bar (home hero uses top-24). */
export const STOREFRONT_MOBILE_BACKDROP_WHITE_TOP_CLASS = 'top-32';

/** Non-home mobile content card offset below header chrome. */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS = 'mt-8';

/** White content card — full-bleed, no pink gutter/backdrop at the bottom (home uses its own shell). */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS =
  `relative z-10 ${STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-white pt-6 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

/** Gap between search row and optional page toolbar. */
export const STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS = 'mt-5';

/** Home mobile sky→pink section — content spacing + bottom nav clearance. */
export const HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS =
  'pb-[calc(120px+env(safe-area-inset-bottom,0px))]';

/** Outer mobile shell — gradient backdrop + horizontal gutter. */
export const STOREFRONT_MOBILE_SHELL_CLASS = `relative lg:hidden ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`;
