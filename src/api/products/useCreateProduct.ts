import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

export type CreateProductRequest = {
  body: {
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
  token: string;
};

const createProduct = async ({ body, token }: CreateProductRequest) => {
  return await fetchApi<ProductSingleResponse>({
    endpoint: '/products',
    method: 'POST',
    body,
    token,
  });
};

export const useCreateProduct = () =>
  useMutation<ProductSingleResponse, Error, CreateProductRequest>({
    mutationFn: createProduct,
    onError: (error) => {
      console.error('Product creation failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product created successfully:', data);
    },
  });
