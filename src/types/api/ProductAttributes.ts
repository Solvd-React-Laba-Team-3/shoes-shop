import { StrapiResponse } from './StrapiResponse';
import { Brand } from '@/types/Brand';
import { Category } from '@/types/Category';
import { Color } from '@/types/Color';
import { Gender } from '@/types/Gender';
import { Size } from '@/types/Size';
import { File } from './File';

export type ProductAttributes = {
  name: string;
  description: string;
  price: number;
  teamName: string;
  images: {
    data: StrapiResponse<File>[] | null;
  };
  brand: {
    data: StrapiResponse<Brand>;
  };
  categories: {
    data: StrapiResponse<Category>[] | null;
  };
  color: {
    data: StrapiResponse<Color>;
  };
  gender: {
    data: StrapiResponse<Gender>;
  };
  sizes: {
    data: StrapiResponse<Size>[];
  };
};
