'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS,
} from '../../app/products/products-page-layout.constants';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import { getCategoryPillLayoutClass } from './category-pill-layout.constants';
import { CategoryPillIcon } from './CategoryPillIcon';

type CategoryFilterPillProps = {
  href: string;
  category: CategoryTreeNode;
  label: string;
  isActive: boolean;
};

function getCategoryPillStateClass(isActive: boolean): string {
  return isActive
    ? PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS
    : PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS;
}

/**
 * Single Figma category filter pill — always a link.
 * Parent categories filter all descendant products (no subcategory dropdown).
 */
export function CategoryFilterPill({
  href,
  category,
  label,
  isActive,
}: CategoryFilterPillProps): ReactElement {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? 'page' : undefined}
      data-category-filter-slug={category.id}
      className={`group ${PRODUCTS_PAGE_CATEGORY_PILL_CLASS} ${getCategoryPillLayoutClass(category.slug)} ${getCategoryPillStateClass(isActive)}`}
    >
      <CategoryPillIcon title={category.title} slug={category.slug} isActive={isActive} />
      <span>{label}</span>
    </Link>
  );
}
