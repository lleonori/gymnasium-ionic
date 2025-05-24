export type TSortBy<T> = {
  sortBy: keyof T;
  orderBy: "asc" | "desc";
};
