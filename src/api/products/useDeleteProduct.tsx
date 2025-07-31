import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';
import { useSession } from 'next-auth/react';

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

export const useDeleteProduct = () => {
  const { update: updateSession } = useSession();

  return useMutation<void, Error, DeleteProductRequest>({
    mutationFn: deleteProduct,
    onSettled: updateSession,
  });
};
