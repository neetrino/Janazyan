'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, type ReactElement } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS,
} from '../../app/products/products-page-layout.constants';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import {
  CATEGORY_PILL_CHEVRON,
  CATEGORY_PILL_CHEVRON_ACTIVE_CLASS,
  CATEGORY_PILL_CHEVRON_OPEN_CLASS,
} from './category-pill-dropdown.constants';
import { useCategoryFilterDropdown } from './CategoryFilterDropdownContext';
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

function CategoryFilterPillLink({
  href,
  category,
  label,
  isActive,
  onNavigate,
}: CategoryFilterPillProps & { onNavigate: () => void }): ReactElement {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? 'page' : undefined}
      data-category-filter-slug={category.id}
      onClick={onNavigate}
      className={`${PRODUCTS_PAGE_CATEGORY_PILL_CLASS} ${getCategoryPillLayoutClass(category.slug)} ${getCategoryPillStateClass(isActive)}`}
    >
      <CategoryPillIcon title={category.title} slug={category.slug} isActive={isActive} />
      <span>{label}</span>
    </Link>
  );
}

function CategoryFilterPillDropdown({
  category,
  label,
  isActive,
}: Omit<CategoryFilterPillProps, 'href'>): ReactElement {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { toggleCategory, isCategoryOpen } = useCategoryFilterDropdown();
  const isOpen = isCategoryOpen(category.id);

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      data-category-filter-slug={category.id}
      onClick={() => {
        if (!triggerRef.current) {
          return;
        }
        toggleCategory(category, triggerRef.current);
      }}
      className={`${PRODUCTS_PAGE_CATEGORY_PILL_CLASS} ${getCategoryPillLayoutClass(category.slug, true)} ${getCategoryPillStateClass(isActive)}`}
    >
      <CategoryPillIcon title={category.title} slug={category.slug} isActive={isActive} />
      <span>{label}</span>
      <Image
        src={CATEGORY_PILL_CHEVRON.src}
        alt=""
        width={CATEGORY_PILL_CHEVRON.width}
        height={CATEGORY_PILL_CHEVRON.height}
        className={`shrink-0 ${CATEGORY_PILL_CHEVRON.className} ${
          isActive ? CATEGORY_PILL_CHEVRON_ACTIVE_CLASS : ''
        } ${isOpen ? CATEGORY_PILL_CHEVRON_OPEN_CLASS : ''}`}
        aria-hidden
      />
    </button>
  );
}

/** Single Figma category filter pill — link or expandable subcategory menu (node 486:355). */
export function CategoryFilterPill({
  href,
  category,
  label,
  isActive,
}: CategoryFilterPillProps): ReactElement {
  const { closeDropdown } = useCategoryFilterDropdown();

  if (category.children.length === 0) {
    return (
      <CategoryFilterPillLink
        href={href}
        category={category}
        label={label}
        isActive={isActive}
        onNavigate={closeDropdown}
      />
    );
  }

  return (
    <CategoryFilterPillDropdown
      category={category}
      label={label}
      isActive={isActive}
    />
  );
}
