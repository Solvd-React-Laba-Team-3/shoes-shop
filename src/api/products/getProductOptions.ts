import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { StrapiError } from '@/types/api/StrapiError';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export type GetProductResponse = ProductSingleResponse;

export const getProductOptions = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetchApi<GetProductResponse>({
        endpoint: `/products/${id}`,
        method: 'GET',
      });

      if ('error' in res) {
        throw res as StrapiError;
      }

      return res;
    },
  });
