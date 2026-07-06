'use client';

import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react';
import { useTranslation } from '../../../../lib/i18n-client';
import {
  getChildCategoryRows,
  getRootCategoryRows,
} from '@/lib/categories/category-sibling-order';
import {
  ADMIN_TABLE,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_THEAD,
} from '../../constants/admin-table-classes';
import type { Category } from '../types';
import { CategorySiblingRows, resolveDropBeforeId } from './CategorySiblingRows';
import {
  type CategoryDragState,
  type CategoryDropIndicator,
  buildOrderedIdsFromDrop,
} from './category-list-drag';

interface CategoriesListProps {
  categories: Category[];
  searchQuery: string;
  reordering: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
  onReorder: (parentId: string | null, orderedIds: string[]) => void;
}

function matchesSearch(category: Category, normalizedSearch: string): boolean {
  return category.title.toLowerCase().includes(normalizedSearch);
}

export function CategoriesList({
  categories,
  searchQuery,
  reordering,
  onEdit,
  onDelete,
  onReorder,
}: CategoriesListProps) {
  const { t } = useTranslation();
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<CategoryDragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<CategoryDropIndicator | null>(null);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const reorderEnabled = !normalizedSearch && !reordering;

  const parentCategories = useMemo(
    () => getRootCategoryRows(categories),
    [categories],
  );

  const childCategoriesByParent = useMemo(() => {
    const parentIds = new Set(
      categories
        .map((category) => category.parentId)
        .filter((parentId): parentId is string => Boolean(parentId)),
    );
    const map = new Map<string, Category[]>();
    parentIds.forEach((parentId) => {
      map.set(parentId, getChildCategoryRows(categories, parentId));
    });
    return map;
  }, [categories]);

  const filteredParentCategories = useMemo(() => {
    if (!normalizedSearch) {
      return parentCategories;
    }

    return parentCategories.filter((category) => {
      const childCategories = childCategoriesByParent.get(category.id) ?? [];
      return (
        matchesSearch(category, normalizedSearch) ||
        childCategories.some((childCategory) => matchesSearch(childCategory, normalizedSearch))
      );
    });
  }, [childCategoriesByParent, normalizedSearch, parentCategories]);

  useEffect(() => {
    setExpandedCategoryIds(new Set());
  }, [normalizedSearch]);

  const clearDrag = useCallback(() => {
    setDragState(null);
    setDropIndicator(null);
  }, []);

  const handleDragOverRow = useCallback(
    (
      event: DragEvent<HTMLTableRowElement>,
      category: Category,
      siblings: Category[],
      parentId: string | null,
    ) => {
      if (!dragState || dragState.parentId !== parentId) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      const rect = event.currentTarget.getBoundingClientRect();
      const insertBefore = event.clientY < rect.top + rect.height / 2;
      const beforeCategoryId = resolveDropBeforeId(category.id, siblings, insertBefore);

      setDropIndicator((current) => {
        if (
          current?.parentId === parentId &&
          current.beforeCategoryId === beforeCategoryId
        ) {
          return current;
        }
        return { parentId, beforeCategoryId };
      });
    },
    [dragState],
  );

  const handleDropAtIndicator = useCallback(
    (siblings: Category[], parentId: string | null, fallbackTarget: Category) => {
      if (!dragState || dragState.parentId !== parentId) {
        clearDrag();
        return;
      }

      const beforeCategoryId =
        dropIndicator?.parentId === parentId
          ? dropIndicator.beforeCategoryId
          : fallbackTarget.id;

      const orderedIds = buildOrderedIdsFromDrop(
        siblings,
        dragState.categoryId,
        beforeCategoryId,
      );
      onReorder(parentId, orderedIds);
      clearDrag();
    },
    [clearDrag, dragState, dropIndicator, onReorder],
  );

  if (filteredParentCategories.length === 0) {
    return <p className="py-2 text-sm text-gray-500">{t('admin.categories.noCategories')}</p>;
  }

  return (
    <div className={ADMIN_TABLE_OUTER_SCROLL}>
      <table className={ADMIN_TABLE}>
        <thead className={ADMIN_TABLE_THEAD}>
          <tr>
            <th className={`${ADMIN_TABLE_TH} w-10`} aria-label={t('admin.categories.order')} />
            <th className={ADMIN_TABLE_TH}>{t('admin.categories.image')}</th>
            <th className={ADMIN_TABLE_TH}>{t('admin.categories.categoryTitle')}</th>
            <th className={ADMIN_TABLE_TH}>{t('admin.products.category')}</th>
            <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.products.actions')}</th>
          </tr>
        </thead>
        <tbody
          className={ADMIN_TABLE_TBODY}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setDropIndicator(null);
            }
          }}
        >
          <CategorySiblingRows
            siblings={filteredParentCategories}
            parentCategory={null}
            siblingParentId={null}
            level={0}
            reorderEnabled={reorderEnabled}
            dragState={dragState}
            dropIndicator={dropIndicator}
            expandedCategoryIds={expandedCategoryIds}
            childCategoriesByParent={childCategoriesByParent}
            onToggle={(categoryId) => {
              setExpandedCategoryIds((current) => {
                const next = new Set(current);
                if (next.has(categoryId)) {
                  next.delete(categoryId);
                } else {
                  next.add(categoryId);
                }
                return next;
              });
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={setDragState}
            onDragEnd={clearDrag}
            onDragOverRow={handleDragOverRow}
            onDropAtIndicator={handleDropAtIndicator}
            renderChildren={(parent) => {
              const childCategories = childCategoriesByParent.get(parent.id) ?? [];
              const visibleChildCategories =
                normalizedSearch && !matchesSearch(parent, normalizedSearch)
                  ? childCategories.filter((child) => matchesSearch(child, normalizedSearch))
                  : childCategories;

              return (
                <CategorySiblingRows
                  siblings={visibleChildCategories}
                  parentCategory={parent}
                  siblingParentId={parent.id}
                  level={1}
                  reorderEnabled={reorderEnabled}
                  dragState={dragState}
                  dropIndicator={dropIndicator}
                  expandedCategoryIds={expandedCategoryIds}
                  childCategoriesByParent={childCategoriesByParent}
                  onToggle={() => undefined}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={setDragState}
                  onDragEnd={clearDrag}
                  onDragOverRow={handleDragOverRow}
                  onDropAtIndicator={handleDropAtIndicator}
                  renderChildren={() => null}
                />
              );
            }}
          />
        </tbody>
      </table>
    </div>
  );
}
