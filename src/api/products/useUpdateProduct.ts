import { useMutation } from '@tanstack/react-query';
import { fetchApi, mapProductResponse } from '@/lib/utils';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';
import { CreateProductRequest } from './useCreateProduct';
import { Product } from '@/types/Product';

export type UpdateProductRequest = {
  body: Partial<CreateProductRequest['body']>;
  token: string;
  id: number;
};

const updateProduct = async ({
  body,
  token,
  id,
}: UpdateProductRequest): Promise<Product> => {
  const res = await fetchApi<ProductSingleResponse>({
    endpoint: `/products/${id}`,
    method: 'PUT',
    body,
    token,
  });
  return mapProductResponse(res.data.id, res.data.attributes);
};

export const useUpdateProduct = () =>
  useMutation<Product, Error, UpdateProductRequest>({
    mutationFn: updateProduct,
    onError: (error) => {
      console.error('Product update failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product updated successfully:', data);
    },
  });
