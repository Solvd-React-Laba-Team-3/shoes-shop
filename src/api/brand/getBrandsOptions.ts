import { fetchApi } from '@/lib/utils';
import { flattenStrapiData } from '@/lib/utils/flattenStrapiData/flattenStrapiData';
import { Brand } from '@/types/Brand';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { queryOptions } from '@tanstack/react-query';

export const GET_BRANDS_QUERY_KEY = 'brands';

export const getBrandsOptions = (
  queryParams?: StrapiQueryParams<keyof Brand>
) =>
  queryOptions({
    queryKey: [GET_BRANDS_QUERY_KEY, queryParams],
    queryFn: async () =>
      flattenStrapiData(
        await fetchApi<StrapiPaginatedData<Brand>>({
          endpoint: '/brands',
          method: 'GET',
          queryParams,
        })
      ),
  });
