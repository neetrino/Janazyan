const ADMIN_PATH_PREFIXES = ['/supersudo', '/admin'] as const;

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isAdminPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);
  return ADMIN_PATH_PREFIXES.some((prefix) => normalizedPathname.startsWith(prefix));
}

/** Public storefront routes (excludes home and admin). */
export function isStorefrontPage(pathname: string): boolean {
  return pathname !== '/' && !isAdminPath(pathname);
}

/** Shop listing — plain white surface (no sky header band or catalog gradient). */
export function isProductsListingPage(pathname: string): boolean {
  return normalizePathname(pathname) === '/products';
}

/** Single product PDP — `/products/[slug]`. */
export function isProductDetailPage(pathname: string): boolean {
  return /^\/products\/[^/]+$/.test(normalizePathname(pathname));
}

/** Mobile catalog gradient surface — shop listing and PDP. */
export function usesCatalogMobileSurface(pathname: string): boolean {
  return isProductsListingPage(pathname) || isProductDetailPage(pathname);
}

/** Order confirmation / detail — `/orders/[number]`. */
export function isOrderDetailPage(pathname: string): boolean {
  return /^\/orders\/[^/]+$/.test(normalizePathname(pathname));
}

/** Profile area — `/profile`. */
export function isProfilePage(pathname: string): boolean {
  return pathname === '/profile' || pathname.startsWith('/profile/');
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

  if (isOrderDetailPage(pathname)) {
    return true;
  }

  return pathname.startsWith('/blog/');
}
