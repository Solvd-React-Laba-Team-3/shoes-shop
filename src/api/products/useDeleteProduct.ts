import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';

export type DeleteProductRequest = {
  token: string;
  id: number;
};

export type DeleteProductResponse = { data?: number };

const deleteProduct = async ({ token, id }: DeleteProductRequest) => {
  return await fetchApi<DeleteProductResponse>({
    endpoint: `/products/${id}`,
    method: 'DELETE',
    token,
  });
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
