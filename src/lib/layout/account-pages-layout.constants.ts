import { STOREFRONT_SIDE_PADDING_NEG_CLASS } from './storefront-layout.constants';
import { STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS } from './storefront-mobile-layout.constants';

/** Tighter mobile inset for checkout, orders, and profile (less side gutter). */
export const ACCOUNT_PAGE_MOBILE_CONTENT_INSET_CLASS = 'px-0 sm:px-6 lg:px-8';

/** Shared inner wrapper — full width on mobile. */
export const ACCOUNT_PAGE_INNER_CLASS =
  'mx-auto w-full py-6 md:py-10 lg:max-w-7xl lg:py-12';

/** Extra clearance for dense account flows with bottom CTAs above mobile nav. */
export const ACCOUNT_PAGE_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS =
  'pb-[calc(128px+env(safe-area-inset-bottom,0px))]';

/** Account mobile content card — leaves room for checkout/order bottom actions. */
export const ACCOUNT_PAGE_MOBILE_CONTENT_SURFACE_CLASS =
  `relative z-10 mt-6 w-auto rounded-t-[44px] bg-white pt-6 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${ACCOUNT_PAGE_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

/** Props shared by checkout / order hero-shell pages on mobile. */
export const ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS = {
  mobileContentInsetClassName: ACCOUNT_PAGE_MOBILE_CONTENT_INSET_CLASS,
  mobileContentSurfaceClassName: ACCOUNT_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} as const;

/** Profile mobile — plain white shell, no search row or gradient header band. */
export const PROFILE_MOBILE_CONTENT_SURFACE_CLASS =
  `relative z-10 w-auto bg-white pt-[max(env(safe-area-inset-top,0px),0.75rem)] ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS}`;

export const PROFILE_PAGE_HERO_SHELL_MOBILE_PROPS = {
  mobileContentInsetClassName: ACCOUNT_PAGE_MOBILE_CONTENT_INSET_CLASS,
  mobileContentSurfaceClassName: PROFILE_MOBILE_CONTENT_SURFACE_CLASS,
  hideMobileTopBar: true,
} as const;

/** Profile mobile shell — full width inside storefront gutter. */
export const PROFILE_MOBILE_OUTER_CLASS = 'mx-auto w-full pb-8 desktop:hidden';

/** Profile mobile card — reduced horizontal padding on narrow screens. */
export const PROFILE_MOBILE_CARD_CLASS =
  'rounded-[2rem] bg-white px-4 pb-7 pt-5 shadow-sm ring-1 ring-gray-200/80 sm:px-5';

/** Bottom sheet — tall enough for forms, with visible backdrop above. */
export const PROFILE_MOBILE_SHEET_HEIGHT_CLASS = 'h-[calc(100dvh-6.5rem)]';

/** Scrollable body inside the sheet (header handle + title row ≈ 4.75rem). */
export const PROFILE_MOBILE_SHEET_BODY_CLASS =
  'h-[calc(100dvh-6.5rem-4.75rem)] overflow-y-auto px-4 py-4 pb-6';
