'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS,
} from '../../app/products/products-page-layout.constants';
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

const CATEGORY_ROW_SCROLL_END_THRESHOLD_PX = 4;

function useCategoryRowScrollFade(rowRef: React.RefObject<HTMLDivElement | null>): boolean {
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFade = useCallback(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }

    const hasOverflow = row.scrollWidth - row.clientWidth > CATEGORY_ROW_SCROLL_END_THRESHOLD_PX;
    const isAtEnd =
      row.scrollLeft + row.clientWidth >= row.scrollWidth - CATEGORY_ROW_SCROLL_END_THRESHOLD_PX;
    setShowRightFade(hasOverflow && !isAtEnd);
  }, [rowRef]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }

    updateFade();
    row.addEventListener('scroll', updateFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateFade);
    resizeObserver.observe(row);

    return () => {
      row.removeEventListener('scroll', updateFade);
      resizeObserver.disconnect();
    };
  }, [rowRef, updateFade]);

  return showRightFade;
}

/** Figma category filter row with expandable subcategory menus (node 269:894 / 486:355). */
export function CategoryFilterPills({
  categories,
  activeCategorySlug,
  language,
}: CategoryFilterPillsProps): ReactElement {
  const searchParams = useSearchParams();
  const rowRef = useRef<HTMLDivElement>(null);
  const showRightFade = useCategoryRowScrollFade(rowRef);

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

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }

    const activePill = row.querySelector<HTMLElement>('[aria-current="page"]');
    activePill?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeCategorySlug, categories]);

  return (
    <div className="relative">
      {showRightFade ? <div aria-hidden className={PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS} /> : null}
      <div ref={rowRef} className={PRODUCTS_PAGE_CATEGORY_ROW_CLASS} data-category-filter-row>
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
    </div>
  );
}
