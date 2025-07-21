import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';

export type DeleteProductRequest = {
  token: string;
  id: number;
};

const deleteProduct = async ({ token, id }: DeleteProductRequest) => {
  return await fetchApi<void>({
    endpoint: `/products/${id}`,
    method: 'DELETE',
    token,
  });
};

export const useDeleteProduct = () =>
  useMutation<void, Error, DeleteProductRequest>({
    mutationFn: deleteProduct,
    onError: (error) => {
      console.error('Product delete failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product deleted successfully:', data);
    },
  });
