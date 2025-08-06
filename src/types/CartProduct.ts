import { File } from './api/File';
import { Gender } from './Gender';

export interface CartProduct {
  id: number;
  name: string;
  gender: Gender;
  description: string;
  price: number;
  images: File[] | null;
  color: { name: string };
  size: number;
  quantity: number;
}
