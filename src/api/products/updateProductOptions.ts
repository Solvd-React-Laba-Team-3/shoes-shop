import { fetchApi } from '@/lib/utils';
import { mutationOptions } from '@tanstack/react-query';
import { StrapiError } from '@/types/api/StrapiError';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { CreateProductRequest } from './createProductOptions';

export type UpdateProductResponse = ProductSingleResponse;
export type UpdateProductRequest = CreateProductRequest;

export const updateProductOptions = mutationOptions({
  mutationKey: ['product', 'update'],
  mutationFn: async ({
    id,
    data,
    token,
  }: {
    id: number;
    data: CreateProductRequest;
    token: string;
  }) => {
    const res = await fetchApi<UpdateProductResponse>({
      endpoint: `/products/${id}`,
      method: 'PUT',
      body: data,
      token,
    });

    if ('error' in res) {
      throw res as StrapiError<keyof UpdateProductRequest['data']>;
    }

    return res;
  },
});
