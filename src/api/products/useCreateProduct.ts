import { useMutation } from '@tanstack/react-query';
import { fetchApi, formatProductAttributes } from '@/lib/utils';
import { Product } from '@/types/Product';
import { ProductAttributes } from '@/types/api/ProductAttributes';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';

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

const createProduct = async ({
  body,
  token,
}: CreateProductRequest): Promise<Product> => {
  const res = await fetchApi<StrapiSingleData<ProductAttributes>>({
    endpoint: '/products',
    method: 'POST',
    body,
    token,
  });
  return formatProductAttributes(res.data.id, res.data.attributes);
};

export const useCreateProduct = () =>
  useMutation<Product, Error, CreateProductRequest>({
    mutationFn: createProduct,
    onError: (error) => {
      console.error('Product creation failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('Product created successfully:', data);
    },
  });
