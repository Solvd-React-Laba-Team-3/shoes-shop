import { renderHook, act } from '@testing-library/react';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { UpdateProductResponse, useUpdateProduct } from './useUpdateProduct';
import {
  createErrorResponse,
  createSuccessResponse,
  createWrapper,
} from '@/testing/utils';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useUpdateProduct', () => {
  it('updates a product successfully', async () => {
    const mockResponse: UpdateProductResponse = {
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

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        id: 1,
        token: 'mock-token',
        body: {
          data: {
            name: 'Updated Product',
            images: [],
            description: 'Updated',
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

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.data.attributes.name).toBe('Updated Product');
    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products/1', method: 'PUT' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockResolvedValueOnce(
      await createErrorResponse(403, 'Forbidden').json()
    );

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
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

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toContain('Forbidden');
  });
});
