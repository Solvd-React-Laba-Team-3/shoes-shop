import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { CreateProductRequest } from './useCreateProduct';

export type UpdateProductRequest = {
  body: Partial<CreateProductRequest['body']>;
  token: string;
  id: number;
};

const updateProduct = async ({ body, token, id }: UpdateProductRequest) => {
  return await fetchApi<ProductSingleResponse>({
    endpoint: `/products/${id}`,
    method: 'PUT',
    body,
    token,
  });
};

export const useUpdateProduct = () =>
  useMutation<ProductSingleResponse, Error, UpdateProductRequest>({
    mutationFn: updateProduct,
    onError: (error) => {
      console.error('Product update failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product updated successfully:', data);
    },
  });
