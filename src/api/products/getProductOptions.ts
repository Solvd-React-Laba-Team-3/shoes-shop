import qs from 'qs';
import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiError } from '@/types/api/StrapiError';
import { ProductAttributes } from './createProductOptions';
import { StrapiQueryParams } from '@/types/api/strapiQueryParams';

export type GetProductsResponse = StrapiPaginatedData<ProductAttributes>;

export type ProductFields =
  | 'name'
  | 'price'
  | 'description'
  | 'teamName'
  | 'gender'
  | 'brand'
  | 'categories'
  | 'color'
  | 'sizes'
  | 'userID'
  | 'images';

export type GetProductsQueryParams = StrapiQueryParams<ProductFields> & {
  locale?: string;
};

export const getProductsOptions = (params: GetProductsQueryParams) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: async () => {
      const queryString = qs.stringify(params, { encodeValuesOnly: true });

      const res = await fetchApi<GetProductsResponse>({
        endpoint: `/products?${queryString}`,
        method: 'GET',
      });

      if ('error' in res) {
        throw res as StrapiError;
      }

      return res;
    },
  });
