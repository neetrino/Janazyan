type SearchParamsLike = {
  get(name: string): string | null;
};

/**
 * Returns whether a main nav link matches the current route.
 */
export function isNavLinkActive(
  pathname: string,
  href: string,
  searchParams: SearchParamsLike,
): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/products?view=categories') {
    return pathname === '/products' && searchParams.get('view') === 'categories';
  }

  if (href === '/products') {
    if (pathname === '/products') {
      return searchParams.get('view') !== 'categories';
    }

    return pathname.startsWith('/products/');
  }

  const basePath = href.split('?')[0] ?? href;

  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}
