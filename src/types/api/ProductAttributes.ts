import { StrapiResponse } from './StrapiResponse';
import { Brand } from '@/types/Brand';
import { Category } from '@/types/Category';
import { Color } from '@/types/Color';
import { Gender } from '@/types/Gender';
import { Size } from '@/types/Size';
import { File as StrapiFile } from './File';

export type ProductAttributes = {
  name: string;
  description: string;
  price: number;
  teamName: string;
  images: {
    data: StrapiResponse<StrapiFile>[];
  };
  brand: {
    data: StrapiResponse<Brand>;
  };
  categories: {
    data: StrapiResponse<Category>[];
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
