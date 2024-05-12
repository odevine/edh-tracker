export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type ColumnSortOrder = "asc" | "desc";

export function getComparator<T>(
  order: ColumnSortOrder,
  orderBy: keyof T,
  userProfileMap?: Map<string, { displayName: string }>,
): (a: T, b: T) => number {
  if (orderBy === "deckOwnerID" && userProfileMap) {
    return order === "desc"
      ? (a, b) => {
          const nameA =
            userProfileMap.get(a[orderBy] as string)?.displayName || "";
          const nameB =
            userProfileMap.get(b[orderBy] as string)?.displayName || "";
          return nameB.localeCompare(nameA);
        }
      : (a, b) => {
          const nameA =
            userProfileMap.get(a[orderBy] as string)?.displayName || "";
          const nameB =
            userProfileMap.get(b[orderBy] as string)?.displayName || "";
          return nameA.localeCompare(nameB);
        };
  }

  return order === "desc"
    ? (a, b) => (a[orderBy] < b[orderBy] ? 1 : -1)
    : (a, b) => (a[orderBy] > b[orderBy] ? 1 : -1);
}
