/** Bottom clearance so catalog/content clears the overlapping footer shell on desktop. */
export const STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS = 'min-[1650px]:pb-[220px]';

/** Extra footer overlap on /contact — pulls footer closer to page content. */
export const CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX = 120;

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

/** Whether the global storefront footer renders for the current route. */
export function shouldShowStorefrontFooter(pathname: string): boolean {
  return !HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Additional negative margin for footer shell on /contact. */
export function resolveContactPageFooterExtraUpPull(pathname: string): number {
  return pathname === '/contact' ? CONTACT_PAGE_FOOTER_EXTRA_UP_PULL_PX : 0;
}

/** Footer overlap padding — only when the footer is visible. */
export function resolveStorefrontMainBottomPaddingClass(pathname: string): string {
  return shouldShowStorefrontFooter(pathname)
    ? STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS
    : '';
}
