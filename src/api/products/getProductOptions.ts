import { StrapiError } from '@/types/StrapiError';
import { ProductAttributes } from './createProductOptions';
import { StrapiSingleData } from '@/types/StrapiSingleData';

export type GetProductResponse = StrapiSingleData<ProductAttributes>;

export const getProduct = async (id: number): Promise<GetProductResponse> => {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products/${id}`,
    {
      method: 'GET',
    }
  );

  if (!res.ok) {
    const error: StrapiError = await res.json();
    throw error;
  }

  return res.json();
};

export const getProductOptions = (id: number) => ({
  queryKey: ['product', id],
  queryFn: () => getProduct(id),
});
