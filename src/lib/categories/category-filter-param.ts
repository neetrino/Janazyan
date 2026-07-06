import {
  SHOP_CATEGORY_SLUGS,
  titleMatchesShopCategorySlug,
  type ShopCategorySlug,
} from './shop-category-slug-keywords';

/** Minimal category fields needed to build a storefront filter query param. */
export type CategoryFilterSource = {
  id: string;
  slug: string;
  title: string;
};

export type ResolveCategoryFilterParamOptions = {
  /** Root toolbar only — subcategory titles often contain parent keywords (e.g. "մազeri"). */
  allowShopSlugFromTitle?: boolean;
};

const CATEGORY_ID_PARAM_PATTERN = /^c[a-z0-9]{20,}$/i;

/** Whether a URL `category` value is a Prisma cuid (fallback when translation slug is empty). */
export function isCategoryIdFilterParam(param: string): boolean {
  return CATEGORY_ID_PARAM_PATTERN.test(param.trim());
}

/** Map a category title to a known shop toolbar slug when the DB slug is missing. */
export function resolveShopCategorySlugFromTitle(title: string): ShopCategorySlug | null {
  for (const shopSlug of SHOP_CATEGORY_SLUGS) {
    if (titleMatchesShopCategorySlug(title, shopSlug)) {
      return shopSlug;
    }
  }
  return null;
}

/**
 * URL `category` query value for a category tree node.
 * Prefers translation slug, then shop title keyword (root only), then stable category id.
 */
export function resolveCategoryFilterParam(
  category: CategoryFilterSource,
  options?: ResolveCategoryFilterParamOptions,
): string {
  const slug = category.slug.trim();
  if (slug && slug !== 'all') {
    return slug;
  }

  if (options?.allowShopSlugFromTitle !== false) {
    const shopSlug = resolveShopCategorySlugFromTitle(category.title);
    if (shopSlug) {
      return shopSlug;
    }
  }

  return category.id;
}

/** Whether an active filter param matches a category node (slug, shop slug, or id). */
export function isCategoryFilterParamActive(
  category: CategoryFilterSource,
  activeParam?: string,
  options?: ResolveCategoryFilterParamOptions,
): boolean {
  if (!activeParam?.trim()) {
    return false;
  }

  const normalized = activeParam.trim();
  if (normalized === category.id) {
    return true;
  }

  return normalized === resolveCategoryFilterParam(category, options);
}
