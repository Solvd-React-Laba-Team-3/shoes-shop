import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, formatProductAttributes } from '@/lib/utils';
import { Product } from '@/types/Product';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { TEAM_NAME } from '@/constants/teamName';
import { useSession } from 'next-auth/react';

export interface CreateProductRequest {
  body: {
    data: {
      name: string;
      images?: number[];
      description: string;
      brand: number | string;
      color: number | string;
      gender: number | string;
      sizes: number[];
      price: number | string;
      userID?: number;
      teamName?: string;
    };
  };
  token?: string;
}

const createProduct = async ({
  body,
  token,
}: CreateProductRequest): Promise<Product> => {
  const res = await fetchApi<StrapiSingleData<ProductAttributes>>({
    endpoint: '/products',
    method: 'POST',
    body: {
      data: {
        ...body.data,
        teamName: TEAM_NAME,
      },
    },
    queryParams: {
      populate: '*',
    },
    token,
  });
  return formatProductAttributes(res.data.id, res.data.attributes);
};

export const useCreateProduct = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Omit<CreateProductRequest, 'token'>>({
    mutationFn: ({ body }) =>
      createProduct({
        body: { data: { ...body.data, userID: session?.user.id } },
        token: session?.user.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile-products'],
      });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    },
  });
};
