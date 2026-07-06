'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, type ReactElement } from 'react';
import { PRODUCTS_PAGE_CATEGORY_ROW_CLASS } from '../../app/products/products-page-layout.constants';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import { buildCategoryFilterHrefFromParams } from '../../lib/categories/category-products-href';
import { isShopToolbarCategoryActive } from '../../lib/categories/shop-category-toolbar';
import { CategoryFilterPill } from './CategoryFilterPill';
import { getCategoryNavLabel } from './category-nav-label';
import type { LanguageCode } from '../../lib/language';

type CategoryFilterPillsProps = {
  categories: CategoryTreeNode[];
  activeCategorySlug?: string;
  language: LanguageCode;
};

/** Figma category filter row with expandable subcategory menus (node 269:894 / 486:355). */
export function CategoryFilterPills({
  categories,
  activeCategorySlug,
  language,
}: CategoryFilterPillsProps): ReactElement {
  const searchParams = useSearchParams();

  const hrefByCategoryId = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(
        category.id,
        buildCategoryFilterHrefFromParams(category, searchParams),
      );
    }
    return map;
  }, [categories, searchParams]);

  return (
    <div className={PRODUCTS_PAGE_CATEGORY_ROW_CLASS} data-category-filter-row>
      {categories.map((category) => {
        const isActive = isShopToolbarCategoryActive(category, activeCategorySlug);

        return (
          <CategoryFilterPill
            key={category.id}
            href={hrefByCategoryId.get(category.id) ?? '/products'}
            category={category}
            label={getCategoryNavLabel(category, language)}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
