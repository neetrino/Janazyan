import { PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS } from '../../app/products/products-page-layout.constants';

/** Same mobile gradient surface as /products and other hero-shell pages. */
export const AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS =
  PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS;

/** Auth pages use full mobile content width — no extra products-page inset. */
export const AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS = 'px-0 sm:px-8';

/** Auth page outer spacing — tight side inset on mobile for maximum form width. */
export const AUTH_PAGE_SHELL_PADDING_CLASS =
  'px-3 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-12';

/** Auth glass card inner padding — compact on mobile, generous from sm up. */
export const AUTH_GLASS_CARD_PADDING_CLASS = 'px-3 py-6 sm:p-8';
