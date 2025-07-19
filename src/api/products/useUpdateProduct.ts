import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { ProductBody } from '@/types/api/ProductBody';

export type UpdateProductRequest = {
  body: ProductBody;
  token: string;
  id: number;
};

export type UpdateProductResponse = ProductSingleResponse;

const updateProduct = async ({ body, token, id }: UpdateProductRequest) => {
  const res = await fetchApi<UpdateProductResponse>({
    endpoint: `/products/${id}`,
    method: 'PUT',
    body,
    token,
  });
  return res;
};

export const useUpdateProduct = () =>
  useMutation<UpdateProductResponse, Error, UpdateProductRequest>({
    mutationFn: updateProduct,
    onError: (error) => {
      console.error('Product update failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product updated successfully:', data);
    },
  });
