'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement, type RefObject } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_CATEGORY_ROW_EDGE_SPACER_CLASS,
  PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS,
} from '../../app/products/products-page-layout.constants';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import {
  buildCategoryFilterHrefFromParams,
  getCategoryProductsHref,
} from '../../lib/categories/category-products-href';
import { resolveCategoryFilterParam } from '../../lib/categories/category-filter-param';
import { isShopToolbarCategoryActive } from '../../lib/categories/shop-category-toolbar';
import { prefetchCategoryCatalog } from '../../lib/products/prefetch-category-catalog';
import { CategoryFilterPill } from './CategoryFilterPill';
import { getCategoryNavLabel } from './category-nav-label';
import type { LanguageCode } from '../../lib/language';

type CategoryFilterPillsProps = {
  categories: CategoryTreeNode[];
  activeCategorySlug?: string;
  language: LanguageCode;
};

const CATEGORY_ROW_SCROLL_END_THRESHOLD_PX = 4;

function resolveCategoryPrefetchParam(category: CategoryTreeNode): string | undefined {
  if (category.slug.trim() === 'all') {
    return undefined;
  }
  return resolveCategoryFilterParam(category);
}

function useCategoryRowScrollFade(rowRef: RefObject<HTMLDivElement | null>): boolean {
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

/** Figma category filter row — flat pills, parent filters include descendants (node 269:894). */
export function CategoryFilterPills({
  categories,
  language,
}: CategoryFilterPillsProps): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rowRef = useRef<HTMLDivElement>(null);
  const showRightFade = useCategoryRowScrollFade(rowRef);
  const warmedCategoriesRef = useRef<Set<string>>(new Set());
  const liveActiveCategorySlug = searchParams.has('category')
    ? searchParams.get('category')?.trim() || undefined
    : undefined;

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

  const warmCategoryCatalog = useCallback(
    (category: CategoryTreeNode, href: string) => {
      if (warmedCategoriesRef.current.has(category.id)) {
        return;
      }
      warmedCategoriesRef.current.add(category.id);
      router.prefetch(href);
      void prefetchCategoryCatalog(language, resolveCategoryPrefetchParam(category));
    },
    [language, router],
  );

  useEffect(() => {
    for (const category of categories) {
      const href = hrefByCategoryId.get(category.id) ?? getCategoryProductsHref(category.slug);
      warmCategoryCatalog(category, href);
    }
  }, [categories, hrefByCategoryId, warmCategoryCatalog]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }

    const activePill = row.querySelector<HTMLElement>('[aria-current="page"]');
    if (!activePill) {
      return;
    }

    // Horizontal-only — avoid scrollIntoView, which can shift the page vertically.
    const rowRect = row.getBoundingClientRect();
    const pillRect = activePill.getBoundingClientRect();
    const overflowLeft = pillRect.left - rowRect.left;
    const overflowRight = pillRect.right - rowRect.right;

    if (overflowLeft < 0) {
      row.scrollBy({ left: overflowLeft, behavior: 'smooth' });
      return;
    }

    if (overflowRight > 0) {
      row.scrollBy({ left: overflowRight, behavior: 'smooth' });
    }
  }, [liveActiveCategorySlug, categories]);

  return (
    <div className="relative">
      {showRightFade ? <div aria-hidden className={PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS} /> : null}
      <div ref={rowRef} className={PRODUCTS_PAGE_CATEGORY_ROW_CLASS} data-category-filter-row>
        <div aria-hidden className={PRODUCTS_PAGE_CATEGORY_ROW_EDGE_SPACER_CLASS} />
        {categories.map((category) => {
          const isActive = isShopToolbarCategoryActive(category, liveActiveCategorySlug);
          const href = hrefByCategoryId.get(category.id) ?? '/products';

          return (
            <CategoryFilterPill
              key={category.id}
              href={href}
              category={category}
              label={getCategoryNavLabel(category, language)}
              isActive={isActive}
              onPrefetch={() => warmCategoryCatalog(category, href)}
            />
          );
        })}
        <div aria-hidden className={PRODUCTS_PAGE_CATEGORY_ROW_EDGE_SPACER_CLASS} />
      </div>
    </div>
  );
}
