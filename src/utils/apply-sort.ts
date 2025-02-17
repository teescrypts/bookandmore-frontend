type DocumentType = Record<string, any>;

function descendingComparator<T>(a: T, b: T, sortBy: keyof T): number {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.
  if (b[sortBy] < a[sortBy]) {
    return -1;
  }
  if (b[sortBy] > a[sortBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(
  sortDir: "asc" | "desc",
  sortBy: keyof T
): (a: T, b: T) => number {
  return sortDir === "desc"
    ? (a, b) => descendingComparator(a, b, sortBy)
    : (a, b) => -descendingComparator(a, b, sortBy);
}

export function applySort<T extends DocumentType>(
  documents: T[],
  sortBy: keyof T,
  sortDir: "asc" | "desc"
): T[] {
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = documents.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);
    if (newOrder !== 0) {
      return newOrder;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
