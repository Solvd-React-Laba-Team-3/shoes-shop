import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchApi } from '@/lib/utils';
import { useUpdateProduct } from './useUpdateProduct';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { ProductAttributes } from '@/types/api/ProductAttributes';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useUpdateProduct', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper(); // fresh QueryClient per test
  });

  it('updates a product successfully', async () => {
    const mockResponse: StrapiSingleData<ProductAttributes> = {
      data: {
        id: 1,
        attributes: {
          name: 'Updated Product',
          description: 'Updated Desc',
          price: 150,
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
                name: 'Brand 1',
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
                  name: 'Category 1',
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
                name: 'Unisex',
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
        },
      },
    };

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        id: 1,
        token: 'mock-token',
        body: {
          data: {
            name: 'Updated Product',
            images: [],
            description: 'Updated Desc',
            brand: 1,
            categories: [1],
            color: 1,
            gender: 1,
            sizes: [1],
            price: 150,
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.name).toBe('Updated Product');
    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products/1', method: 'PUT' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Forbidden'));

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        id: 1,
        token: 'mock-token',
        body: {
          data: {
            name: 'Fail Product',
            images: [],
            description: '',
            brand: 1,
            categories: [],
            color: 1,
            gender: 1,
            sizes: [],
            price: 0,
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('Forbidden');
  });
});
