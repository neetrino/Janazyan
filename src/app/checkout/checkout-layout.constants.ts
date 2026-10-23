import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../components/auth/auth-layout.constants';

/** Same hero shell as /about so the blue shape sits in the same place. */
export const CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS = {
  compactMobileTop: false,
  compactContentSpacing: true,
  mobileContentInsetClassName: AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  mobileContentSurfaceClassName: AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} as const;

/**
 * Sticky sidebar column — sticks while scrolling the checkout form on lg+.
 * `144px` = header band 120px + 24px gap, so the card clears the header.
 */
export const CHECKOUT_ORDER_SUMMARY_COLUMN_CLASS =
  'w-full lg:col-span-1 lg:self-start lg:sticky lg:top-[144px] lg:z-10';

/** Offset when scrolling invalid fields into view on mobile (below top bar). */
export const CHECKOUT_FIELD_SCROLL_MARGIN_CLASS = 'scroll-mt-28';

/** Page title — aligns with glass card inner padding on mobile. */
export const CHECKOUT_PAGE_TITLE_CLASS =
  'mb-8 px-4 text-3xl font-bold text-gray-900 sm:px-6';

/** Order summary label/value rows — value stays right on one line. */
export const CHECKOUT_SUMMARY_ROW_CLASS = 'flex items-center justify-between gap-4';

export const CHECKOUT_SUMMARY_LABEL_CLASS = 'shrink-0 text-gray-600';

export const CHECKOUT_SUMMARY_VALUE_CLASS = 'shrink-0 text-right whitespace-nowrap';
