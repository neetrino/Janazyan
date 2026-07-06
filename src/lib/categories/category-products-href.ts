import type {
  CategoryFilterSource,
  ResolveCategoryFilterParamOptions,
} from './category-filter-param';
import { resolveCategoryFilterParam } from './category-filter-param';

/**
 * Storefront href for a shop category filter (home posters, mobile tabs, toolbar).
 */
export function getCategoryProductsHref(slug: string): string {
  if (!slug || slug === 'all') {
    return '/products';
  }
  return `/products?category=${encodeURIComponent(slug)}`;
}

/** Href for a category tree node — handles empty DB slugs via shop keywords or id. */
export function getCategoryTreeNodeHref(
  category: CategoryFilterSource,
  options?: ResolveCategoryFilterParamOptions,
): string {
  const param = resolveCategoryFilterParam(category, options);
  return getCategoryProductsHref(param);
}

type SearchParamsLike = Pick<URLSearchParams, 'toString' | 'get'>;

/**
 * Category filter href that preserves sort (and other) query params — for client toolbar links.
 */
export function buildCategoryFilterHrefFromParams(
  category: CategoryFilterSource,
  searchParams: SearchParamsLike,
  options?: ResolveCategoryFilterParamOptions,
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete('page');

  if (category.slug.trim() === 'all') {
    params.delete('category');
    const query = params.toString();
    return query ? `/products?${query}` : '/products';
  }

  params.set('category', resolveCategoryFilterParam(category, options));
  return `/products?${params.toString()}`;
}
