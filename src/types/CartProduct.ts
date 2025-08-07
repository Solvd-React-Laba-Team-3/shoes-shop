import { File } from './api/File';
// import { Gender } from './Gender';

export interface CartProduct {
  id: number;
  name: string;
  gender: string;
  description: string;
  price: number;
  images: File[] | null;
  color: string;
  size: number;
  quantity: number;
}
