import type { CategoryDropIndicator } from './category-list-drag';

export function isDropLineAbove(
  indicator: CategoryDropIndicator | null,
  parentId: string | null,
  categoryId: string,
  draggingCategoryId: string | null,
): boolean {
  if (!indicator || indicator.parentId !== parentId) {
    return false;
  }

  if (indicator.beforeCategoryId !== categoryId) {
    return false;
  }

  return categoryId !== draggingCategoryId;
}

export function isDropLineBelow(
  indicator: CategoryDropIndicator | null,
  parentId: string | null,
  isLastSibling: boolean,
): boolean {
  if (!isLastSibling || !indicator || indicator.parentId !== parentId) {
    return false;
  }

  return indicator.beforeCategoryId === 'end';
}
