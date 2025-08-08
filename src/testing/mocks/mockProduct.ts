import { Product } from '@/types/Product';

export const mockProduct: Product = {
  id: 1,
  name: 'Test Shoes',
  price: 199.99,
  gender: { id: 1, name: 'Men', createdAt: '', updatedAt: '', publishedAt: '' },
  description: 'Test description',
  brand: {
    id: 1,
    name: 'Test Brand',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
  categories: [
    {
      id: 1,
      name: 'Test Category',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
  color: {
    id: 1,
    name: 'Test Color',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
  sizes: [
    {
      id: 1,
      value: 42,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
  images: [
    {
      id: 1,
      name: 'Test Image',
      alternativeText: 'Alt Text',
      caption: '',
      width: 100,
      height: 100,
      hash: 'hash',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 1,
      url: '/test-image.jpg',
      previewUrl: '/test-image.jpg',
      provider: 'local',
      provider_metadata: {
        public_id: 'mock-public-id',
        resource_type: 'image',
      },
      createdAt: '0000-00-00',
      updatedAt: '0000-00-00',
      formats: {},
    },
  ],
};
