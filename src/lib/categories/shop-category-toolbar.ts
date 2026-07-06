import type { LanguageCode } from '../language';
import { t } from '../i18n';
import type { CategoryTreeNode } from './category-tree';
import { isCategoryFilterParamActive } from './category-filter-param';
import { getCategoriesTreeCached } from './categories-tree-cache';
import { getCategoryTreeNodeHref } from './category-products-href';

const SHOP_TOOLBAR_ALL_ID = 'shop-toolbar-all';

function buildAllToolbarCategory(language: LanguageCode): CategoryTreeNode {
  return {
    id: SHOP_TOOLBAR_ALL_ID,
    slug: 'all',
    title: t(language, 'products.categoryNavigation.all'),
    fullPath: getCategoryTreeNodeHref({ id: SHOP_TOOLBAR_ALL_ID, slug: 'all', title: 'all' }),
    children: [],
  };
}

/**
 * Shop toolbar strip — published root categories from the database + "All".
 */
export async function getShopCategoryToolbarStrip(
  language: LanguageCode,
): Promise<CategoryTreeNode[]> {
  const { data: tree } = await getCategoriesTreeCached(language);
  return [buildAllToolbarCategory(language), ...tree];
}

/** Whether a toolbar category or one of its subcategories matches the active slug. */
export function isShopToolbarCategoryActive(
  category: CategoryTreeNode,
  activeCategorySlug?: string,
): boolean {
  if (category.slug === 'all') {
    return !activeCategorySlug;
  }

  if (!activeCategorySlug) {
    return false;
  }

  if (isCategoryFilterParamActive(category, activeCategorySlug)) {
    return true;
  }

  return category.children.some((child) =>
    isCategoryFilterParamActive(child, activeCategorySlug, { allowShopSlugFromTitle: false }),
  );
}

export function getShopSubcategoryHref(category: CategoryTreeNode): string {
  return getCategoryTreeNodeHref(category, { allowShopSlugFromTitle: false });
}
