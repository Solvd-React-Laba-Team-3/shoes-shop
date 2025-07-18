import { StrapiError } from '@/types/api/StrapiError';
import { mutationOptions } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export type CreateProductRequest = {
  data: {
    name: string;
    images: (string | number)[];
    description: string;
    brand: string | number;
    categories: (string | number)[];
    color: string | number;
    gender: string | number;
    sizes: (string | number)[];
    price: number;
    userID?: string | number;
    teamName?: string;
  };
};

export type CreateProductResponse = ProductSingleResponse;

export const createProductOptions = mutationOptions({
  mutationKey: ['product', 'create'],
  mutationFn: async ({
    body,
    token,
  }: {
    body: CreateProductRequest;
    token: string;
  }) => {
    const res = await fetchApi<CreateProductResponse>({
      endpoint: '/products',
      method: 'POST',
      body,
      token,
    });

    if ('error' in res) {
      throw res as StrapiError<keyof CreateProductRequest['data']>;
    }

    return res;
  },
});
