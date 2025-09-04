import { formatProductAttributes } from './formatProductAttributes';
import { ProductAttributes } from '@/types/api/ProductAttributes';

describe('formatProductAttributes', () => {
  it('should correctly map complete ProductAttributes to a clean Product', () => {
    const productResponseMock: ProductAttributes = {
      id: 1,
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
            id: 1,
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
              id: 1,
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
            id: 1,
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
            id: 1,
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
              id: 1,
              value: 42,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-02',
              publishedAt: '2023-01-03',
            },
          },
        ],
      },
    };

    const result = formatProductAttributes(1, productResponseMock);

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
        id: 1,
        name: 'Nike',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      categories: [
        {
          id: 1,
          name: 'Shoes',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
          publishedAt: '2023-01-03',
        },
      ],
      color: {
        id: 1,
        name: 'Red',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      gender: {
        id: 1,
        name: 'Men',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      sizes: [
        {
          id: 1,
          value: 42,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
          publishedAt: '2023-01-03',
        },
      ],
    });
  });

  it('should handle missing optional fields', () => {
    const productResponseMock: ProductAttributes = {
      id: 1,
      name: 'Test Product',
      description: 'A description',
      price: 199,
      teamName: 'team-1',
      images: { data: [] },
      brand: {
        data: {
          id: 0,
          attributes: {
            id: 0,
            name: '',
            createdAt: '',
            updatedAt: '',
            publishedAt: '',
          },
        },
      },
      categories: { data: [] },
      color: {
        data: {
          id: 0,
          attributes: {
            id: 0,
            name: '',
            createdAt: '',
            updatedAt: '',
            publishedAt: '',
          },
        },
      },
      gender: {
        data: {
          id: 0,
          attributes: {
            id: 0,
            name: '',
            createdAt: '',
            updatedAt: '',
            publishedAt: '',
          },
        },
      },
      sizes: { data: [] },
    };

    const result = formatProductAttributes(1, productResponseMock);

    expect(result).toEqual({
      id: 1,
      name: 'Test Product',
      description: 'A description',
      price: 199,
      teamName: 'team-1',
      images: [],
      brand: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      categories: [],
      color: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      gender: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      sizes: [],
    });
  });

  it('should handle empty arrays', () => {
    const productResponseMock: ProductAttributes = {
      id: 1,
      name: 'Test Product',
      description: 'A sample description',
      price: 199,
      teamName: 'team-1',
      images: { data: [] },
      brand: {
        data: {
          id: 1,
          attributes: {
            id: 1,
            name: 'Nike',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            publishedAt: '2023-01-03',
          },
        },
      },
      categories: { data: [] },
      color: {
        data: {
          id: 1,
          attributes: {
            id: 1,
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
            id: 1,
            name: 'Men',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            publishedAt: '2023-01-03',
          },
        },
      },
      sizes: { data: [] },
    };

    const result = formatProductAttributes(1, productResponseMock);

    expect(result).toEqual({
      id: 1,
      name: 'Test Product',
      description: 'A sample description',
      price: 199,
      teamName: 'team-1',
      images: [],
      brand: {
        id: 1,
        name: 'Nike',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      categories: [],
      color: {
        id: 1,
        name: 'Red',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      gender: {
        id: 1,
        name: 'Men',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        publishedAt: '2023-01-03',
      },
      sizes: [],
    });
  });
});
