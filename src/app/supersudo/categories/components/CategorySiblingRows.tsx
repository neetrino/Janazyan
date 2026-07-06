'use client';

import { Fragment, type DragEvent, type ReactNode } from 'react';
import { Button } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import {
  type CategoryDragState,
  type CategoryDropIndicator,
  resolveDropBeforeId,
} from './category-list-drag';
import { isDropLineAbove, isDropLineBelow } from './category-drop-line';
import {
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_TD,
} from '../../constants/admin-table-classes';
import type { Category, CategoryWithLevel } from '../types';

function processImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}

function setRowDragImage(event: DragEvent<HTMLButtonElement>) {
  const row = event.currentTarget.closest('tr');
  if (!row) {
    return;
  }

  const clone = row.cloneNode(true) as HTMLElement;
  const width = row.getBoundingClientRect().width;
  clone.className = `${clone.className} opacity-95 shadow-xl ring-2 ring-blue-300 bg-white`;
  clone.style.width = `${width}px`;
  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.left = '-9999px';
  clone.style.pointerEvents = 'none';
  document.body.appendChild(clone);
  event.dataTransfer.setDragImage(clone, 40, 28);
  window.setTimeout(() => {
    document.body.removeChild(clone);
  }, 0);
}

function CategoryDragHandle({
  categoryId,
  parentId,
  disabled,
  onDragStart,
  onDragEnd,
}: {
  categoryId: string;
  parentId: string | null;
  disabled: boolean;
  onDragStart: (state: CategoryDragState) => void;
  onDragEnd: () => void;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', categoryId);
        setRowDragImage(event);
        onDragStart({ categoryId, parentId });
      }}
      onDragEnd={onDragEnd}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded text-gray-400 ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab hover:bg-gray-100 active:cursor-grabbing'
      }`}
      aria-label={t('admin.categories.dragToReorder')}
      title={t('admin.categories.dragToReorder')}
    >
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <circle cx="5" cy="4" r="1.2" />
        <circle cx="11" cy="4" r="1.2" />
        <circle cx="5" cy="8" r="1.2" />
        <circle cx="11" cy="8" r="1.2" />
        <circle cx="5" cy="12" r="1.2" />
        <circle cx="11" cy="12" r="1.2" />
      </svg>
    </button>
  );
}

interface CategoryTableRowProps {
  category: CategoryWithLevel;
  parentCategory: Category | null;
  childCount: number;
  isExpanded: boolean;
  siblingParentId: string | null;
  reorderEnabled: boolean;
  dragState: CategoryDragState | null;
  showDropLineAbove: boolean;
  showDropLineBelow: boolean;
  onToggle: () => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
  onDragStart: (state: CategoryDragState) => void;
  onDragEnd: () => void;
  onDragOverRow: (event: DragEvent<HTMLTableRowElement>, category: Category) => void;
  onDropOnRow: (category: Category) => void;
}

function CategoryTableRow({
  category,
  parentCategory,
  childCount,
  isExpanded,
  siblingParentId,
  reorderEnabled,
  dragState,
  showDropLineAbove,
  showDropLineBelow,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDropOnRow,
}: CategoryTableRowProps) {
  const { t } = useTranslation();
  const hasChildren = childCount > 0;
  const titleOffsetClass = category.level > 0 ? 'pl-9' : '';
  const isDragging = dragState?.categoryId === category.id;
  const rowClassName = [
    ADMIN_TABLE_ROW,
    isDragging && 'bg-blue-50/40 opacity-35 outline outline-2 outline-dashed -outline-offset-2 outline-blue-200',
    showDropLineAbove && 'shadow-[inset_0_3px_0_0_#60a5fa]',
    showDropLineBelow && 'shadow-[inset_0_-3px_0_0_#60a5fa]',
    showDropLineAbove && 'bg-blue-50/30',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr
      className={rowClassName}
      onDragOver={(event) => {
        if (!reorderEnabled || !dragState) {
          return;
        }
        onDragOverRow(event, category);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropOnRow(category);
      }}
    >
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap`}>
        <CategoryDragHandle
          categoryId={category.id}
          parentId={siblingParentId}
          disabled={!reorderEnabled}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </td>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap`}>
        {category.imageUrl ? (
          <img
            src={processImageUrl(category.imageUrl)}
            alt={category.title}
            className="h-10 w-10 rounded border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
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
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-800"
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
            className="text-red-600 hover:bg-red-50 hover:text-red-800"
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

interface CategorySiblingRowsProps {
  siblings: Category[];
  parentCategory: Category | null;
  siblingParentId: string | null;
  level: number;
  reorderEnabled: boolean;
  dragState: CategoryDragState | null;
  dropIndicator: CategoryDropIndicator | null;
  expandedCategoryIds: Set<string>;
  childCategoriesByParent: Map<string, Category[]>;
  onToggle: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
  onDragStart: (state: CategoryDragState) => void;
  onDragEnd: () => void;
  onDragOverRow: (
    event: DragEvent<HTMLTableRowElement>,
    category: Category,
    siblings: Category[],
    parentId: string | null,
  ) => void;
  onDropAtIndicator: (
    siblings: Category[],
    parentId: string | null,
    fallbackTarget: Category,
  ) => void;
  renderChildren: (parent: Category) => ReactNode;
}

export function CategorySiblingRows({
  siblings,
  parentCategory,
  siblingParentId,
  level,
  reorderEnabled,
  dragState,
  dropIndicator,
  expandedCategoryIds,
  childCategoriesByParent,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDropAtIndicator,
  renderChildren,
}: CategorySiblingRowsProps) {
  const draggingCategoryId = dragState?.categoryId ?? null;

  return (
    <>
      {siblings.map((category, index) => {
        const childCategories = childCategoriesByParent.get(category.id) ?? [];
        const isExpanded = expandedCategoryIds.has(category.id);
        const showDropLineAbove = isDropLineAbove(
          dropIndicator,
          siblingParentId,
          category.id,
          draggingCategoryId,
        );
        const showDropLineBelow = isDropLineBelow(
          dropIndicator,
          siblingParentId,
          index === siblings.length - 1,
        );

        return (
          <Fragment key={category.id}>
            <CategoryTableRow
              category={{ ...category, level }}
              parentCategory={parentCategory}
              childCount={childCategories.length}
              isExpanded={isExpanded}
              siblingParentId={siblingParentId}
              reorderEnabled={reorderEnabled}
              dragState={dragState}
              showDropLineAbove={showDropLineAbove}
              showDropLineBelow={showDropLineBelow}
              onToggle={() => onToggle(category.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOverRow={(event, row) =>
                onDragOverRow(event, row, siblings, siblingParentId)
              }
              onDropOnRow={() => onDropAtIndicator(siblings, siblingParentId, category)}
            />
            {level === 0 && isExpanded && renderChildren(category)}
          </Fragment>
        );
      })}
    </>
  );
}

export { resolveDropBeforeId };
