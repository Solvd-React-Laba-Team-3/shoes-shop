import { fetchApi } from '@/lib/utils';
import { mutationOptions } from '@tanstack/react-query';
import { StrapiError } from '@/types/api/StrapiError';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export type DeleteProductResponse = ProductSingleResponse;

export const deleteProductOptions = mutationOptions({
  mutationKey: ['product', 'delete'],
  mutationFn: async ({ id, token }: { id: number; token: string }) => {
    const res = await fetchApi<DeleteProductResponse>({
      endpoint: `/products/${id}`,
      method: 'DELETE',
      token,
    });

    if ('error' in res) {
      throw res as StrapiError;
    }

    return res;
  },
});
