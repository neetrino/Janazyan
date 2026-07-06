/** Row with sibling-scoped sort index (categories.position). */
export type CategoryPositionRow = {
  id: string;
  parentId: string | null;
  position: number;
};

/** Sort rows by position within the same parent group. */
export function sortCategoryRowsBySiblingPosition<T extends CategoryPositionRow>(
  rows: T[],
): T[] {
  return [...rows].sort((left, right) => {
    if (left.position !== right.position) {
      return left.position - right.position;
    }
    return left.id.localeCompare(right.id);
  });
}

/** Root categories only, ordered by position. */
export function getRootCategoryRows<T extends CategoryPositionRow>(rows: T[]): T[] {
  return sortCategoryRowsBySiblingPosition(rows.filter((row) => !row.parentId));
}

/** Direct children of a parent, ordered by position. */
export function getChildCategoryRows<T extends CategoryPositionRow>(
  rows: T[],
  parentId: string,
): T[] {
  return sortCategoryRowsBySiblingPosition(
    rows.filter((row) => row.parentId === parentId),
  );
}
