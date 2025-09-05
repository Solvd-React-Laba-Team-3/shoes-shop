import { StrapiResponse } from './StrapiResponse';

export interface StrapiPaginatedData<T> {
  data: StrapiResponse<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
