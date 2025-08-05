import { File } from './api/File';
export interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  images: File[] | null;
  color: { name: string };
  size: number;
  quantity: number;
}
