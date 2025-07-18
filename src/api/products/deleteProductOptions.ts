import { fetchApi } from '@/lib/utils';
import { mutationOptions } from '@tanstack/react-query';
import { StrapiError } from '@/types/api/StrapiError';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { ProductAttributes } from './createProductOptions';

export type DeleteProductResponse = StrapiSingleData<ProductAttributes>;

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
