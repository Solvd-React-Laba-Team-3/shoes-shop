import { StrapiError } from '@/types/StrapiError';
import {
  CreateProductRequest,
  CreateProductResponse,
} from './createProductOptions';

export type UpdateProductResponse = CreateProductResponse;

export const updateProduct = async (
  id: number,
  updatedProduct: CreateProductRequest
): Promise<UpdateProductResponse> => {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    }
  );

  if (!res.ok) {
    const error: StrapiError<keyof CreateProductRequest['data']> =
      await res.json();
    throw error;
  }

  return res.json();
};

export const updateProductOptions = {
  mutationFn: ({ id, data }: { id: number; data: CreateProductRequest }) =>
    updateProduct(id, data),
};
