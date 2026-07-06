import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../components/auth/auth-layout.constants';

/** Checkout mobile — gradient catalog surface like /login. */
export const CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS = {
  mobileContentInsetClassName: AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  mobileContentSurfaceClassName: AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} as const;

/** Sticky sidebar column — sticks while scrolling the checkout form on lg+. */
export const CHECKOUT_ORDER_SUMMARY_COLUMN_CLASS =
  'w-full lg:col-span-1 lg:self-start lg:sticky lg:top-8 lg:z-10';

/** Offset when scrolling invalid fields into view on mobile (below top bar). */
export const CHECKOUT_FIELD_SCROLL_MARGIN_CLASS = 'scroll-mt-28';

/** Scrollable pickup store list shell class (compact height vs /stores page). */
export const CHECKOUT_PICKUP_STORE_LIST_SHELL_CLASS = 'checkout-pickup-stores-directory';
