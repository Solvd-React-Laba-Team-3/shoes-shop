import { StrapiResponse } from './StrapiResponse';

export interface PaginatedData<T> {
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
