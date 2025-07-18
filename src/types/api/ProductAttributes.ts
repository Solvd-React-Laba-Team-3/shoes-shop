import { StrapiResponse } from './StrapiResponse';

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
