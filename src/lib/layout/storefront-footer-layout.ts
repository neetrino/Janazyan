/** Bottom clearance so catalog/content clears the overlapping footer shell on desktop. */
export const STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS = 'lg:pb-[220px]';

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

/** Whether the global storefront footer renders for the current route. */
export function shouldShowStorefrontFooter(pathname: string): boolean {
  return !HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Footer overlap padding — only when the footer is visible. */
export function resolveStorefrontMainBottomPaddingClass(pathname: string): string {
  return shouldShowStorefrontFooter(pathname)
    ? STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS
    : '';
}
