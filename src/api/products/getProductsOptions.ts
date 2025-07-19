import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { CreateProductRequest } from './useCreateProduct';

export type ProductsQueries = keyof CreateProductRequest['body']['data'];

export type ProductsQueryParams = StrapiQueryParams<ProductsQueries> & {
  locale?: string;
};

export const getProductsOptions = (params: ProductsQueryParams) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: async () => {
      return await fetchApi<StrapiPaginatedData<ProductAttributes>>({
        endpoint: `/products`,
        method: 'GET',
        queryParams: params,
      });
    },
  });
