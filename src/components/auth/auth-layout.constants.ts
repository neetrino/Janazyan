import {
  PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_MOBILE_CONTENT_ONLY_CATALOG_SURFACE_CLASS,
} from '../../app/products/products-page-layout.constants';
import { STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';

/**
 * Auth mobile gradient surface — content-only top spacing, nav-height clearance only
 * (avoids the taller shop padding band under short login/register forms).
 */
export const AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS =
  PRODUCTS_PAGE_MOBILE_CONTENT_ONLY_CATALOG_SURFACE_CLASS.replace(
    PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS,
    STOREFRONT_MOBILE_BOTTOM_NAV_CLEARANCE_CLASS,
  );

/** Auth pages use full mobile content width — no extra products-page inset. */
export const AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS = 'px-0 sm:px-8';

/** Auth page outer spacing — tight side inset on mobile for maximum form width. */
export const AUTH_PAGE_SHELL_PADDING_CLASS =
  'px-3 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-8';

/** Auth glass card inner padding — compact on mobile, generous from sm up. */
export const AUTH_GLASS_CARD_PADDING_CLASS = 'px-3 py-6 sm:p-8';
