export type PartnerStoreDragScope = 'region' | 'area' | 'store';

export type PartnerStoreDragState = {
  scope: PartnerStoreDragScope;
  id: string;
  regionId: string | null;
  areaId: string | null;
  siblingIds: string[];
};

export type PartnerStoreDropIndicator = {
  scope: PartnerStoreDragScope;
  regionId: string | null;
  areaId: string | null;
  beforeId: string | 'end';
};

/** Reorders sibling ids by inserting draggedId before beforeId (or at end). */
export function buildOrderedIdsFromDrop(
  siblingIds: string[],
  draggedId: string,
  beforeId: string | 'end',
): string[] | null {
  if (!siblingIds.includes(draggedId)) {
    return null;
  }

  const ids = siblingIds.filter((id) => id !== draggedId);
  if (beforeId === 'end') {
    ids.push(draggedId);
    return ids;
  }

  const insertIndex = ids.indexOf(beforeId);
  if (insertIndex < 0) {
    return null;
  }

  ids.splice(insertIndex, 0, draggedId);
  return ids;
}

export function resolveDropBeforeId(
  targetId: string,
  siblingIds: string[],
  insertBefore: boolean,
): string | 'end' {
  if (insertBefore) {
    return targetId;
  }

  const targetIndex = siblingIds.indexOf(targetId);
  if (targetIndex < 0 || targetIndex >= siblingIds.length - 1) {
    return 'end';
  }

  return siblingIds[targetIndex + 1];
}
