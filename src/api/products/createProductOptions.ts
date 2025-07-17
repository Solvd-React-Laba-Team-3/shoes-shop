import { StrapiSingleData } from '@/types/StrapiSingleData';
import { StrapiResponse } from '@/types/StrapiResponse';
import { StrapiError } from '@/types/StrapiError';

export type ProductAttributes = {
  name: string;
  description: string;
  price: number;
  teamName: string;
  images: {
    data: StrapiResponse<{
      url: string;
      altText?: string;
    }>;
  };
  brand: {
    data: StrapiResponse<{
      name: string;
    }>;
  };
};

export type CreateProductRequest = {
  data: {
    name: string;
    images: (string | number)[];
    description: string;
    brand: string | number;
    categories: (string | number)[];
    color: string | number;
    gender: string | number;
    sizes: (string | number)[];
    price: number;
    userID?: string | number;
    teamName?: string;
  };
};

export type CreateProductResponse = StrapiSingleData<ProductAttributes>;

export const createProduct = async (
  newProduct: CreateProductRequest
): Promise<CreateProductResponse> => {
  const res = await fetch(
    'https://shoes-shop-strapi.herokuapp.com/api/products',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    }
  );

  if (!res.ok) {
    const error: StrapiError<keyof CreateProductRequest['data']> =
      await res.json();
    throw error;
  }

  return res.json();
};

export const createProductOptions = {
  mutationfn: createProduct,
};
