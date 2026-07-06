/** Bottom clearance so catalog/content clears the overlapping footer shell on desktop. */
export const STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS = 'min-[1650px]:pb-[220px]';

/** Extra footer overlap on /contact — pulls footer closer to page content. */
export const CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX = 120;

/** /products catalog — removes compact-footer top gap and blends into purple footer. */
export const PRODUCTS_PAGE_FOOTER_EXTRA_UP_PULL_PX = 160;

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

/** Whether the global storefront footer renders for the current route. */
export function shouldShowStorefrontFooter(pathname: string): boolean {
  return !HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isProductsCatalogFooterRoute(pathname: string): boolean {
  return pathname === '/products' || /^\/products\/[^/]+$/.test(pathname);
}

/** Additional negative margin for footer shell — route-specific overlap tuning. */
export function resolvePageFooterExtraUpPull(pathname: string): number {
  if (pathname === '/contact') {
    return CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX;
  }

  if (isProductsCatalogFooterRoute(pathname)) {
    return PRODUCTS_PAGE_FOOTER_EXTRA_UP_PULL_PX;
  }

  return 0;
}

/** @deprecated Use {@link resolvePageFooterExtraUpPull}. */
export function resolveContactPageFooterExtraUpPull(pathname: string): number {
  return resolvePageFooterExtraUpPull(pathname);
}

/** Footer overlap padding — only when the footer is visible. */
export function resolveStorefrontMainBottomPaddingClass(pathname: string): string {
  return shouldShowStorefrontFooter(pathname)
    ? STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS
    : '';
}
