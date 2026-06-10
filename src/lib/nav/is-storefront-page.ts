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

const STOREFRONT_HERO_SHELL_EXACT_PATHS = [
  '/products',
  '/about',
  '/stores',
  '/contact',
  '/faq',
  '/blog',
  '/checkout',
  '/login',
  '/register',
] as const;

/** Global layout header is omitted — page supplies embedded header (hero shell or home). */
export function shouldHideGlobalHeader(pathname: string): boolean {
  return (
    pathname === '/' || isStorefrontPage(pathname) || isAdminPath(pathname)
  );
}

/** Storefront pages that use the rounded hero shell with embedded header (same as /products). */
export function usesStorefrontHeroShell(pathname: string): boolean {
  if (STOREFRONT_HERO_SHELL_EXACT_PATHS.some((path) => pathname === path)) {
    return true;
  }

  return pathname.startsWith('/blog/');
}
