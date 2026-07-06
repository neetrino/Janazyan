import type { Category } from '../types';

export type DropBeforeCategoryId = string | 'end';

export type CategoryDragState = {
  categoryId: string;
  parentId: string | null;
};

export type CategoryDropIndicator = {
  parentId: string | null;
  beforeCategoryId: DropBeforeCategoryId;
};

export function resolveDropBeforeId(
  targetCategoryId: string,
  siblings: Category[],
  insertBefore: boolean,
): DropBeforeCategoryId {
  if (insertBefore) {
    return targetCategoryId;
  }

  const targetIndex = siblings.findIndex((row) => row.id === targetCategoryId);
  if (targetIndex === -1 || targetIndex >= siblings.length - 1) {
    return 'end';
  }

  return siblings[targetIndex + 1].id;
}

export function reorderSiblingIds(ids: string[], draggedId: string, targetId: string): string[] {
  const fromIndex = ids.indexOf(draggedId);
  const toIndex = ids.indexOf(targetId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return ids;
  }

  const nextIds = [...ids];
  nextIds.splice(fromIndex, 1);
  nextIds.splice(toIndex, 0, draggedId);
  return nextIds;
}

export function buildOrderedIdsFromDrop(
  siblings: Category[],
  draggedId: string,
  beforeCategoryId: DropBeforeCategoryId,
): string[] {
  const ids = siblings.map((row) => row.id).filter((id) => id !== draggedId);
  const insertIndex =
    beforeCategoryId === 'end'
      ? ids.length
      : ids.findIndex((id) => id === beforeCategoryId);

  if (insertIndex === -1) {
    return siblings.map((row) => row.id);
  }

  ids.splice(insertIndex, 0, draggedId);
  return ids;
}
