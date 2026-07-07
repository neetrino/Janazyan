/** Bottom clearance so catalog/content clears the overlapping footer shell on desktop. */
export const STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS = 'min-[1650px]:pb-[220px]';

/** Extra footer overlap on /contact — pulls footer closer to page content. */
export const CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX = 120;

/** Default desktop footer shell overlap (see Footer.tsx). */
export const FOOTER_DESKTOP_SHELL_UP_PULL_PX = 400;

/** /products — footer sits below cards; no upward shell overlap. */
export const PRODUCTS_PAGE_FOOTER_SHELL_UP_PULL_PX = 0;

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

/** Whether the global storefront footer renders for the current route. */
export function shouldShowStorefrontFooter(pathname: string): boolean {
  return !HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** /products — footer sits flush below catalog; no white gutter before the shell. */
export const PRODUCTS_PAGE_FOOTER_COMPACT_TOP_MARGIN_CLASS = 'md:max-[1649px]:mt-0';

function isProductsCatalogFooterRoute(pathname: string): boolean {
  return pathname === '/products' || /^\/products\/[^/]+$/.test(pathname);
}

/** Desktop footer shell overlap — 0 on /products so cards are not covered. */
export function resolvePageFooterShellUpPullPx(pathname: string): number {
  if (isProductsCatalogFooterRoute(pathname)) {
    return PRODUCTS_PAGE_FOOTER_SHELL_UP_PULL_PX;
  }

  return FOOTER_DESKTOP_SHELL_UP_PULL_PX;
}

/** Additional negative margin for footer shell — route-specific overlap tuning. */
export function resolvePageFooterExtraUpPull(pathname: string): number {
  if (pathname === '/contact') {
    return CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX;
  }

  if (isProductsCatalogFooterRoute(pathname)) {
    return 0;
  }

  return 0;
}

/** Compact footer top gap — catalog pages keep the sky gradient flush to the footer shell. */
export function resolvePageFooterCompactTopMarginClass(pathname: string): string {
  if (isProductsCatalogFooterRoute(pathname)) {
    return PRODUCTS_PAGE_FOOTER_COMPACT_TOP_MARGIN_CLASS;
  }

  return '';
}

/** @deprecated Use {@link resolvePageFooterExtraUpPull}. */
export function resolveContactPageFooterExtraUpPull(pathname: string): number {
  return resolvePageFooterExtraUpPull(pathname);
}

/** Footer overlap padding — only when the footer overlaps content. */
export function resolveStorefrontMainBottomPaddingClass(pathname: string): string {
  if (!shouldShowStorefrontFooter(pathname)) {
    return '';
  }

  if (isProductsCatalogFooterRoute(pathname)) {
    return '';
  }

  return STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS;
}
