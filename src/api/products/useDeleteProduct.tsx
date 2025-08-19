import { useMutation } from '@tanstack/react-query';
import { fetchApi, getQueryClient } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export type DeleteProductRequest = {
  token?: string;
  id: number;
};

const deleteProduct = async ({ token, id }: DeleteProductRequest) => {
  return await fetchApi<void>({
    endpoint: `/products/${id}`,
    method: 'DELETE',
    token,
  });
};

export const useDeleteProduct = () => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();

  return useMutation<void, Error, Omit<DeleteProductRequest, 'token'>>({
    mutationFn: ({ id }) =>
      deleteProduct({ id, token: session?.user.accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile-products'],
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
    },
  });
};
