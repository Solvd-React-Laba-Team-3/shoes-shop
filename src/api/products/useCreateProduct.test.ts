import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { CreateProductResponse, useCreateProduct } from './useCreateProduct';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useCreateProduct', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper(); // fresh QueryClient for each test
  });

  it('creates a product successfully', async () => {
    const mockResponse: CreateProductResponse = {
      data: {
        id: 1,
        attributes: {
          name: 'Test Product',
          description: 'Desc',
          price: 100,
          teamName: 'team-1',
          images: {
            data: {
              id: 1,
              attributes: {
                url: '/test-image.jpg',
                altText: 'Test Image',
              },
            },
          },
          brand: {
            data: {
              id: 1,
              attributes: {
                name: 'Brand 1',
              },
            },
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

    expect(result.current.data?.data.id).toBe(1);
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
