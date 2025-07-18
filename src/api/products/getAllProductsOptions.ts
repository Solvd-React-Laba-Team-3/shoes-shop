import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiError } from '@/types/api/StrapiError';
import { ProductAttributes } from './createProductOptions';
import { StrapiQueryParams } from '@/types/api/strapiQueryParams';
import qs from 'qs';

export type GetProductsResponse = StrapiPaginatedData<ProductAttributes>;

export type ProductFields =
  | 'name'
  | 'price'
  | 'description'
  | 'teamName'
  | 'gender'
  | 'brand'
  | 'categories'
  | 'color'
  | 'sizes'
  | 'userID'
  | 'images';

export type GetProductsQueryParams = StrapiQueryParams<ProductFields> & {
  locale?: string;
};

export const getProducts = async (
  params: GetProductsQueryParams = {}
): Promise<GetProductsResponse> => {
  const queryString = qs.stringify(params, {
    encodeValuesOnly: true,
  });

  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products?${queryString}`,
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

export const getProductsOptions = (params?: GetProductsQueryParams) => ({
  queryKey: ['products', params],
  queryFn: () => getProducts(params),
});
