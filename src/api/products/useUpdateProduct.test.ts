import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { useUpdateProduct } from './useUpdateProduct';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useUpdateProduct', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper(); // fresh QueryClient per test
  });

  it('updates a product successfully', async () => {
    const mockResponse: ProductSingleResponse = {
      data: {
        id: 1,
        attributes: {
          name: 'Updated Product',
          description: 'Updated Desc',
          price: 150,
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

    expect(result.current.data?.data.attributes.name).toBe('Updated Product');
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
