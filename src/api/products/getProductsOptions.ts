import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiError } from '@/types/api/StrapiError';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { CreateProductRequest } from './createProductOptions';

export type ProductsQueries = keyof CreateProductRequest['data'];

export type ProductsQueryParams = StrapiQueryParams<ProductsQueries> & {
  locale?: string;
};

export type GetProductsResponse = StrapiPaginatedData<ProductAttributes>;

export const getProductsOptions = (params: ProductsQueryParams) =>
  queryOptions({
    queryKey: ['products', JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetchApi<GetProductsResponse>({
        endpoint: `/products`,
        method: 'GET',
        queryParams: params,
      });

      if ('error' in res) {
        throw res as StrapiError;
      }

      return res;
    },
  });
