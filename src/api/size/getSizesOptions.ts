import { fetchApi, flatStrapiData } from '@/lib/utils';
import { Size } from '@/types/Size';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { queryOptions } from '@tanstack/react-query';

export const GET_SIZES_QUERY_KEY = 'sizes';

export const getSizesOptions = (queryParams?: StrapiQueryParams<keyof Size>) =>
  queryOptions({
    queryKey: [GET_SIZES_QUERY_KEY, queryParams],
    queryFn: async () =>
      flatStrapiData<Size>(
        await fetchApi<StrapiPaginatedData<Size>>({
          endpoint: '/sizes',
          method: 'GET',
          queryParams,
        })
      ),
  });
