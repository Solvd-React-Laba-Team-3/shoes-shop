import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export type DeleteProductRequest = {
  token: string;
  id: number;
};

export type DeleteProductResponse = ProductSingleResponse;

const deleteProduct = async ({ token, id }: DeleteProductRequest) => {
  const res = await fetchApi<DeleteProductResponse>({
    endpoint: `/products/${id}`,
    method: 'DELETE',
    token,
  });

  return res;
};

export const useDeleteProduct = () =>
  useMutation<DeleteProductResponse, Error, DeleteProductRequest>({
    mutationFn: deleteProduct,
    onError: (error) => {
      console.error('Product delete failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product deleted successfully:', data);
    },
  });
