import { fetchApi } from '@/lib/utils';
import { Color } from '@/types/Color';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { queryOptions } from '@tanstack/react-query';

export const GET_COLORS_QUERY_KEY = 'colors';

export const getColorsOptions = (
  queryParams?: StrapiQueryParams<keyof Color>
) =>
  queryOptions({
    queryKey: [GET_COLORS_QUERY_KEY, queryParams],
    queryFn: async () =>
      await fetchApi<StrapiPaginatedData<Color>>({
        endpoint: '/colors',
        method: 'GET',
        queryParams,
      }),
  });
