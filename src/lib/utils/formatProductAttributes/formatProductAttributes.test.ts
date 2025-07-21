import { formatProductAttributes } from './formatProductAttributes';
import { ProductAttributes } from '@/types/api/ProductAttributes';

describe('formatProductAttributes', () => {
  it('should correctly map ProductAttributes to a clean Product', () => {
    const mockAttributes: ProductAttributes = {
      name: 'Test Product',
      description: 'A sample description',
      price: 199,
      teamName: 'team-1',
      images: {
        data: [
          {
            id: 10,
            attributes: {
              id: 10,
              url: '/uploads/image.jpg',
              alternativeText: 'Sample Image',
              caption: null,
              width: 100,
              height: 100,
              formats: {},
              hash: 'hash',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 123,
              previewUrl: null,
              provider: 'local',
              provider_metadata: {
                public_id: 'some_id',
                resource_type: 'image',
              },
              name: 'image.jpg',
              createdAt: '2023-01-01',
              updatedAt: '2023-01-02',
            },
          },
        ],
      },
      brand: {
        data: {
          id: 1,
          attributes: {
            name: 'Nike',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            publishedAt: '2023-01-03',
          },
        },
      },
      categories: {
        data: [
          {
            id: 1,
            attributes: {
              name: 'Shoes',
              createdAt: '2023-01-01',
              updatedAt: '2023-01-02',
              publishedAt: '2023-01-03',
            },
          },
        ],
      },
      color: {
        data: {
          id: 1,
          attributes: {
            name: 'Red',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            publishedAt: '2023-01-03',
          },
        },
      },
      gender: {
        data: {
          id: 1,
          attributes: {
            name: 'Men',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            publishedAt: '2023-01-03',
          },
        },
      },
      sizes: {
        data: [
          {
            id: 1,
            attributes: {
              value: 42,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-02',
              publishedAt: '2023-01-03',
            },
          },
        ],
      },
    };

    const result = formatProductAttributes(1, mockAttributes);

    expect(result).toEqual({
      id: 1,
      name: 'Test Product',
      description: 'A sample description',
      price: 199,
      teamName: 'team-1',
      images: [
        {
          id: 10,
          url: '/uploads/image.jpg',
          alternativeText: 'Sample Image',
          caption: null,
          width: 100,
          height: 100,
          formats: {},
          hash: 'hash',
          ext: '.jpg',
          mime: 'image/jpeg',
          size: 123,
          previewUrl: null,
          provider: 'local',
          provider_metadata: {
            public_id: 'some_id',
            resource_type: 'image',
          },
          name: 'image.jpg',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
        },
      ],
      brand: {
        name: 'Nike',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      categories: [
        {
          name: 'Shoes',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
          publishedAt: '2023-01-03',
        },
      ],
      color: {
        name: 'Red',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      gender: {
        name: 'Men',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      sizes: [
        {
          value: 42,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
          publishedAt: '2023-01-03',
        },
      ],
    });
  });
});
