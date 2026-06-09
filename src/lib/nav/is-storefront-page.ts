const ADMIN_PATH_PREFIXES = ['/supersudo', '/admin'] as const;

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Public storefront routes (excludes home and admin). */
export function isStorefrontPage(pathname: string): boolean {
  return pathname !== '/' && !isAdminPath(pathname);
}

/** Shop listing — plain white surface (no sky header band or catalog gradient). */
export function isProductsListingPage(pathname: string): boolean {
  return pathname === '/products';
}
