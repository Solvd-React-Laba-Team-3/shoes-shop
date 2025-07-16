export type StrapiQueryParams<Fields extends string> = {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: `${Fields}:${'asc' | 'desc'}` | Array<`${Fields}:${'asc' | 'desc'}`>;
  populate?: '*' | Fields | Fields[];
  filters?: Partial<Record<Fields, unknown>>;
};
