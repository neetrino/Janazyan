import type { LanguageCode } from '../../lib/language';
import { t } from '../../lib/i18n';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';

/**
 * Display label for a category nav pill (server + client).
 */
export function getCategoryNavLabel(
  category: CategoryTreeNode,
  language: LanguageCode
): string {
  const title = category.title;
  const slug = category.slug.toLowerCase();

  if (slug === 'all') {
    return t(language, 'products.categoryNavigation.shopAll');
  }
  if (title.toLowerCase().includes('new')) {
    return t(language, 'products.categoryNavigation.newArrivals');
  }
  if (title.toLowerCase().includes('sale')) {
    return t(language, 'products.categoryNavigation.sale');
  }
  return title;
}

export function getCategoryNavHref(slug: string): string {
  if (slug === 'all') {
    return '/products';
  }
  return `/products?category=${encodeURIComponent(slug)}`;
}
