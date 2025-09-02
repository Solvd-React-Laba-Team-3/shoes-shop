import { useMutation } from '@tanstack/react-query';
import { fetchApi, formatProductAttributes, getQueryClient } from '@/lib/utils';
import { CreateProductRequest } from './useCreateProduct';
import { Product } from '@/types/Product';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { useSession } from 'next-auth/react';

export interface UpdateProductRequest {
  body: {
    data: Partial<CreateProductRequest['body']['data']>;
  };
  token?: string;
  id: number;
}

const updateProduct = async ({
  body,
  token,
  id,
}: UpdateProductRequest): Promise<Product> => {
  const res = await fetchApi<StrapiSingleData<ProductAttributes>>({
    endpoint: `/products/${id}`,
    method: 'PUT',
    body,
    token,
    queryParams: {
      populate: '*',
    },
  });

  return formatProductAttributes(res.data.id, res.data.attributes);
};

export const useUpdateProduct = () => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();

  return useMutation<Product, Error, Omit<UpdateProductRequest, 'token'>>({
    mutationFn: ({ body, id }) =>
      updateProduct({
        body: { data: { ...body.data, userID: session?.user.id } },
        id,
        token: session?.user.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile-products'],
      });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
    },
  });
};
