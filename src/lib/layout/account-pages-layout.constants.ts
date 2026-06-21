/** Tighter mobile inset for checkout, orders, and profile (less side gutter). */
export const ACCOUNT_PAGE_MOBILE_CONTENT_INSET_CLASS = 'px-0 sm:px-6 lg:px-8';

/** Shared inner wrapper — full width on mobile. */
export const ACCOUNT_PAGE_INNER_CLASS =
  'mx-auto w-full py-6 md:py-10 lg:max-w-7xl lg:py-12';

/** Props shared by checkout / order hero-shell pages on mobile. */
export const ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS = {
  mobileContentInsetClassName: ACCOUNT_PAGE_MOBILE_CONTENT_INSET_CLASS,
} as const;

/** Profile mobile shell — full width inside storefront gutter. */
export const PROFILE_MOBILE_OUTER_CLASS = 'mx-auto w-full pb-8 pt-2 lg:hidden';

/** Profile mobile card — reduced horizontal padding on narrow screens. */
export const PROFILE_MOBILE_CARD_CLASS =
  'rounded-[2rem] bg-white px-4 pb-7 pt-5 shadow-sm ring-1 ring-gray-200/80 sm:px-5';

/** Bottom sheet — tall enough for forms, with visible backdrop above. */
export const PROFILE_MOBILE_SHEET_HEIGHT_CLASS = 'h-[calc(100dvh-6.5rem)]';

/** Scrollable body inside the sheet (header handle + title row ≈ 4.75rem). */
export const PROFILE_MOBILE_SHEET_BODY_CLASS =
  'h-[calc(100dvh-6.5rem-4.75rem)] overflow-y-auto px-4 py-4 pb-6';
