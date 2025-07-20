import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchApi } from '@/lib/utils';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { useCreateProduct } from './useCreateProduct';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useCreateProduct', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper(); // fresh QueryClient for each test
  });

  it('creates a product successfully', async () => {
    const mockResponse: ProductSingleResponse = {
      data: {
        id: 123,
        attributes: {
          name: 'Single Product',
          description: 'Single Desc',
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
                name: 'male',
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

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        token: 'mock-token',
        body: {
          data: {
            name: 'Test Product',
            images: [],
            description: 'Desc',
            brand: 1,
            categories: [1],
            color: 1,
            gender: 1,
            sizes: [1],
            price: 100,
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe(123);
    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products', method: 'POST' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Validation failed'));

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        token: 'mock-token',
        body: {
          data: {
            name: '',
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

    expect(result.current.error?.message).toContain('Validation failed');
  });
});
