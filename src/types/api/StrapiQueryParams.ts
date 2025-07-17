type SortOption<Fields extends string> =
  | `${Fields}:${'asc' | 'desc'}`
  | Array<`${Fields}:${'asc' | 'desc'}`>;

export type StrapiQueryParams<Fields extends string> = {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: SortOption<Fields>;
  populate?: '*' | Fields | Fields[];
  filters?: Partial<Record<Fields, string | number | boolean | string[]>>;
};
