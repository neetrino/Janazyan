import {
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
  STOREFRONT_SIDE_PADDING_NEG_CLASS,
  STOREFRONT_TABLET_DOWN_CLASS,
} from './storefront-layout.constants';

/** Home mobile header — flush with viewport top; clears notch/status bar only. */
export const HOME_MOBILE_HEADER_TOP_INSET_CLASS = 'pt-[env(safe-area-inset-top,0px)]';

/** Home mobile top bar — stays pinned to the viewport top while scrolling. */
export const HOME_MOBILE_HEADER_STICKY_CLASS = 'sticky top-0';

/** Sticky bar fill — matches MobileBackdrop sky band at the top edge. */
export const HOME_MOBILE_HEADER_STICKY_BG_CLASS = 'bg-[#ecf5ff]';

/** @deprecated Use {@link HOME_MOBILE_HEADER_TOP_INSET_CLASS}. */
export const STOREFRONT_MOBILE_TOP_INSET_CLASS = HOME_MOBILE_HEADER_TOP_INSET_CLASS;

/** Non-home mobile hero shell — tighter top inset than home. */
export const STOREFRONT_MOBILE_HERO_SHELL_TOP_INSET_CLASS = 'pt-2';

/** Mobile header chrome — above content cards so search dropdown is never covered. */
export const STOREFRONT_MOBILE_HEADER_CHROME_Z_INDEX_CLASS = 'z-30';

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

/** Content-only pages (no toolbar) — shorter sky band below the search row. */
export const STOREFRONT_MOBILE_CONTENT_ONLY_BACKDROP_WHITE_TOP_CLASS = 'top-24';

/** Non-home mobile content card offset below header chrome. */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS = 'mt-8';

/** Content-only pages — tighter gap between search row and content card. */
export const STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_MARGIN_CLASS = 'mt-3';

/** Content-only pages — less inner padding at the top of the content card. */
export const STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_PADDING_CLASS = 'pt-3';

/** Shared page title block — reduced top padding on mobile. */
export const STOREFRONT_PAGE_HEADER_SECTION_CLASS = 'py-4 md:py-12';

/** Page body wrapper — top inset only (keeps existing bottom padding). */
export const STOREFRONT_PAGE_CONTENT_TOP_PADDING_CLASS = 'pt-4 md:pt-12';

/** White content card — full-bleed, no pink gutter/backdrop at the bottom (home uses its own shell). */
export const STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS =
  `relative z-10 ${STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-white pt-6 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

/** Content-only white content card — tighter top spacing on mobile. */
export const STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_CLASS =
  `relative z-10 ${STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-white ${STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_PADDING_CLASS} ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

/** Gap between search row and optional page toolbar. */
export const STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS = 'mt-5';

/** Home mobile sky→pink section — content spacing + bottom nav clearance. */
export const HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS =
  'pb-[calc(120px+env(safe-area-inset-bottom,0px))]';

/** Outer mobile shell — gradient backdrop + horizontal gutter. */
export const STOREFRONT_MOBILE_SHELL_CLASS = `relative ${STOREFRONT_TABLET_DOWN_CLASS} ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`;
