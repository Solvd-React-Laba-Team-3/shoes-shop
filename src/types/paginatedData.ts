export interface PaginatedData<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export type StrapiGetResponse<T, U> = PaginatedData<T>;

export interface StrapiDefaultQueryParams<T> {
  'pagination[page]'?: number;
  pageSize?: number;
  sort?: string;
  filters?: U;
  fields: keyof T | (keyof T)[];
}
