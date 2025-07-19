export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  teamName?: string;
  images: { url: string; altText?: string }[];
  brand: string;
  categories: string[];
  color: string;
  gender: string;
  sizes: string[];
};
