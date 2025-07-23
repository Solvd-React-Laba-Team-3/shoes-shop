import { fetchApi, formatProductAttributes } from '@/lib/utils';
import { infiniteQueryOptions } from '@tanstack/react-query';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiQueryParams } from '@/types/api/StrapiQueryParams';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { CreateProductRequest } from './useCreateProduct';

export type ProductsQueries = keyof CreateProductRequest['body']['data'];

export type ProductsQueryParams = StrapiQueryParams<ProductsQueries> & {
  locale?: string;
};

export const getProductsOptions = (params: ProductsQueryParams) =>
  infiniteQueryOptions({
    queryKey: ['products', params],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('Fetching products with params:', params);
      const res = await fetchApi<StrapiPaginatedData<ProductAttributes>>({
        endpoint: `/products`,
        method: 'GET',
        queryParams: {
          ...params,
          pagination: {
            page: pageParam,
            pageSize: params.pagination?.pageSize ?? 10,
          },
        },
      });
      console.log('Fetched response:', res);
      return {
        products: res.data.map((p) =>
          formatProductAttributes(p.id, p.attributes)
        ),
        meta: res.meta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.pagination.page + 1;
      return nextPage <= lastPage.meta.pagination.pageCount
        ? nextPage
        : undefined;
    },
  });
