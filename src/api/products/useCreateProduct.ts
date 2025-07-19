import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { ProductBody } from '@/types/api/ProductBody';
import { StrapiError } from '@/types/api/StrapiError';

export type CreateProductRequest = {
  body: ProductBody;
  token: string;
};

export type CreateProductResponse = ProductSingleResponse;

const createProduct = async ({ body, token }: CreateProductRequest) => {
  const res = await fetchApi<CreateProductResponse>({
    endpoint: '/products',
    method: 'POST',
    body,
    token,
  });

  if ('error' in res) {
    const error = res as StrapiError;
    throw new Error(error.error.message ?? 'Unknown error');
  }

  return res;
};

export const useCreateProduct = () =>
  useMutation<CreateProductResponse, Error, CreateProductRequest>({
    mutationFn: createProduct,
    onError: (error) => {
      console.error('Product creation failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product created successfully:', data);
    },
  });
