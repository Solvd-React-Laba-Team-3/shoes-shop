import { Color } from './Color';
import { Brand } from './Brand';
import { Gender } from './Gender';
import { Category } from './Category';
import { Size } from './Size';
import { File } from './api/File';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  teamName?: string;
  images: File[] | null;
  brand: Brand;
  categories: Category[] | null;
  color: Color;
  gender: Gender;
  sizes: Size[];
};
