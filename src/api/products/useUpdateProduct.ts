import { useMutation } from '@tanstack/react-query';
import { fetchApi, formatProductAttributes } from '@/lib/utils';
import { CreateProductRequest } from './useCreateProduct';
import { Product } from '@/types/Product';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { ProductAttributes } from '@/types/api/ProductAttributes';

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
  const res = await fetchApi<StrapiSingleData<ProductAttributes>>({
    endpoint: `/products/${id}`,
    method: 'PUT',
    body,
    token,
  });
  return formatProductAttributes(res.data.id, res.data.attributes);
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
