import { fetchApi } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';
import { formatProductAttributes } from '@/lib/utils';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';

export const getProductOptions = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetchApi<StrapiSingleData<ProductAttributes>>({
        endpoint: `/products/${id}`,
        method: 'GET',
        queryParams: {
          populate: '*',
        },
      });
      return formatProductAttributes(res.data.id, res.data.attributes);
    },
  });
