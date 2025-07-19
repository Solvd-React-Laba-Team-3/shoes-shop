import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export const getProductOptions = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: async () => {
      return await fetchApi<ProductSingleResponse>({
        endpoint: `/products/${id}`,
        method: 'GET',
      });
    },
  });
