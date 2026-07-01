/**
 * Storefront href for a shop category filter (home posters, mobile tabs, toolbar).
 */
export function getCategoryProductsHref(slug: string): string {
  if (!slug || slug === 'all') {
    return '/products';
  }
  return `/products?category=${encodeURIComponent(slug)}`;
}
