import { fetchApi } from '@/lib/utils';
import { mutationOptions } from '@tanstack/react-query';
import { StrapiError } from '@/types/api/StrapiError';
import {
  CreateProductRequest,
  CreateProductResponse,
} from './createProductOptions';

export type UpdateProductResponse = CreateProductResponse;

export const updateProductOptions = mutationOptions({
  mutationKey: ['product', 'update'],
  mutationFn: async ({
    id,
    data,
  }: {
    id: number;
    data: CreateProductRequest;
  }) => {
    const res = await fetchApi<UpdateProductResponse>({
      endpoint: `/products/${id}`,
      method: 'PUT',
      body: data,
    });

    if ('error' in res) {
      throw res as StrapiError<keyof CreateProductRequest['data']>;
    }

    return res;
  },
});
