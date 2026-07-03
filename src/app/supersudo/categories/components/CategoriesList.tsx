'use client';

import { Fragment, useState, useEffect } from 'react';
import { Button } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import { CategoriesPagination } from './CategoriesPagination';
import {
  ADMIN_TABLE,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_THEAD,
} from '../../constants/admin-table-classes';
import type { Category, CategoryWithLevel } from '../types';

interface CategoriesListProps {
  categories: Category[];
  searchQuery: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
}

const ITEMS_PER_PAGE = 20;

function processImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}

function buildChildrenByParent(categories: Category[]): Map<string, Category[]> {
  const childrenByParent = new Map<string, Category[]>();

  categories.forEach((category) => {
    if (!category.parentId) return;

    const children = childrenByParent.get(category.parentId) ?? [];
    children.push(category);
    childrenByParent.set(category.parentId, children);
  });

  return childrenByParent;
}

function matchesSearch(category: Category, normalizedSearch: string): boolean {
  return category.title.toLowerCase().includes(normalizedSearch);
}

export function CategoriesList({ categories, searchQuery, onEdit, onDelete }: CategoriesListProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const childrenByParent = buildChildrenByParent(categories);
  const parentCategories = categories.filter((category) => !category.parentId);
  const filteredCategories = normalizedSearch
    ? parentCategories.filter((category) => {
        const childCategories = childrenByParent.get(category.id) ?? [];

        return (
          matchesSearch(category, normalizedSearch) ||
          childCategories.some((childCategory) => matchesSearch(childCategory, normalizedSearch))
        );
      })
    : parentCategories;

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to page 1 when categories or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [categories.length, normalizedSearch]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(categoryId)) {
        nextIds.delete(categoryId);
      } else {
        nextIds.add(categoryId);
      }

      return nextIds;
    });
  };

  if (filteredCategories.length === 0) {
    return <p className="text-sm text-gray-500 py-2">{t('admin.categories.noCategories')}</p>;
  }

  return (
    <>
      <div className={ADMIN_TABLE_OUTER_SCROLL}>
        <table className={ADMIN_TABLE}>
          <thead className={ADMIN_TABLE_THEAD}>
            <tr>
              <th className={ADMIN_TABLE_TH}>{t('admin.categories.image')}</th>
              <th className={ADMIN_TABLE_TH}>{t('admin.categories.categoryTitle')}</th>
              <th className={ADMIN_TABLE_TH}>{t('admin.products.category')}</th>
              <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.products.actions')}</th>
            </tr>
          </thead>
          <tbody className={ADMIN_TABLE_TBODY}>
            {paginatedCategories.map((category: Category) => {
              const childCategories = childrenByParent.get(category.id) ?? [];
              const isExpanded = expandedCategoryIds.has(category.id);
              const visibleChildCategories = normalizedSearch && !matchesSearch(category, normalizedSearch)
                ? childCategories.filter((childCategory) =>
                    matchesSearch(childCategory, normalizedSearch),
                  )
                : childCategories;

              return (
                <Fragment key={category.id}>
                  <CategoryTableRow
                    category={{ ...category, level: 0 }}
                    parentCategory={null}
                    childCount={childCategories.length}
                    isExpanded={isExpanded}
                    onToggle={() => toggleCategory(category.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                  {isExpanded &&
                    visibleChildCategories.map((childCategory) => (
                      <CategoryTableRow
                        key={childCategory.id}
                        category={{ ...childCategory, level: 1 }}
                        parentCategory={category}
                        childCount={0}
                        isExpanded={false}
                        onToggle={() => undefined}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <CategoriesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCategories.length}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

interface CategoryTableRowProps {
  category: CategoryWithLevel;
  parentCategory: Category | null;
  childCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
}

function CategoryTableRow({
  category,
  parentCategory,
  childCount,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  const { t } = useTranslation();
  const hasChildren = childCount > 0;
  const titleOffsetClass = category.level > 0 ? 'pl-9' : '';

  return (
    <tr className={ADMIN_TABLE_ROW}>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap`}>
        {category.imageUrl ? (
          <img
            src={processImageUrl(category.imageUrl)}
            alt={category.title}
            className="h-10 w-10 rounded object-cover border border-gray-200"
          />
        ) : (
          <div className="h-10 w-10 rounded border border-dashed border-gray-300 text-xs text-gray-400 flex items-center justify-center">
            —
          </div>
        )}
      </td>
      <td className={`${ADMIN_TABLE_TD} text-left text-gray-900`}>
        <div className={`flex items-center gap-2 ${titleOffsetClass}`}>
          <div>
            <div className="text-sm font-medium">{category.title}</div>
            <div className="text-xs text-gray-500">{category.slug}</div>
          </div>
        </div>
      </td>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-left text-gray-700`}>
        {parentCategory ? parentCategory.title : t('admin.categories.rootCategory')}
      </td>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center`}>
        <div className="flex items-center justify-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            aria-label={t('admin.common.edit')}
            title={t('admin.common.edit')}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id, category.title)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
            aria-label={t('admin.common.delete')}
            title={t('admin.common.delete')}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
          {category.level === 0 && hasChildren && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
              aria-expanded={isExpanded}
            >
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}




