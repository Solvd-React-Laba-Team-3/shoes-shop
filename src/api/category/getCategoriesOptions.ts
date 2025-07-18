import { fetchApi } from '@/lib/utils';
import { Category } from '@/types/Category';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { queryOptions } from '@tanstack/react-query';

export const GET_CATEGORIES_QUERY_KEY = 'categories';

export const getCategoriesOptions = (
  queryParams?: StrapiQueryParams<keyof Category>
) =>
  queryOptions({
    queryKey: [GET_CATEGORIES_QUERY_KEY, queryParams],
    queryFn: async () => {
      await fetchApi<StrapiPaginatedData<Category>>({
        endpoint: '/categories',
        method: 'GET',
        queryParams: queryParams,
      });
    },
  });
