import { StrapiError } from '@/types/StrapiError';
import { StrapiSingleData } from '@/types/StrapiSingleData';
import { ProductAttributes } from './createProductOptions';

export type DeleteProductResponse = StrapiSingleData<ProductAttributes>;

export const deleteProduct = async (
  id: number
): Promise<DeleteProductResponse> => {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products/${id}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    const error: StrapiError = await res.json();
    throw error;
  }

  return res.json();
};

export const deleteProductOptions = {
  mutationFn: (id: number) => deleteProduct(id),
};
