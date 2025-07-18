import { fetchApi } from '@/lib/utils';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { Gender } from '@/types/Gender';
import { queryOptions } from '@tanstack/react-query';

export const GET_GENDERS_QUERY_KEY = 'genders';

export const getGendersOptions = (
  queryParams?: StrapiQueryParams<keyof Gender>
) =>
  queryOptions({
    queryKey: [GET_GENDERS_QUERY_KEY, queryParams],
    queryFn: async () =>
      await fetchApi<StrapiPaginatedData<Gender>>({
        endpoint: '/genders',
        method: 'GET',
        queryParams,
      }),
  });
