import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { mapProductResponse } from '@/lib/utils';

export const getProductOptions = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetchApi<ProductSingleResponse>({
        endpoint: `/products/${id}`,
        method: 'GET',
      });
      return mapProductResponse(res.data.id, res.data.attributes);
    },
  });
