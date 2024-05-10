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

export function getComparator<T>(order: ColumnSortOrder, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
      ? (a: T, b: T) => (a[orderBy] < b[orderBy] ? 1 : -1)
      : (a: T, b: T) => (a[orderBy] > b[orderBy] ? 1 : -1);
}
