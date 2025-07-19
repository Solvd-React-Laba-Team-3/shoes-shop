import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import {
  createErrorResponse,
  createSuccessResponse,
  createWrapper,
} from '@/testing/utils';
import { getProductsOptions, GetProductsResponse } from './getProductsOptions';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('getProductsOptions', () => {
  it('fetches products successfully', async () => {
    const mockResponse: GetProductsResponse = {
      data: [
        {
          id: 1,
          attributes: {
            name: 'Product 1',
            description: 'Desc 1',
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
        {
          id: 2,
          attributes: {
            name: 'Product 2',
            description: 'Desc 2',
            price: 200,
            teamName: 'team-1',
            images: {
              data: {
                id: 2,
                attributes: {
                  url: '/test-image.jpg',
                  altText: 'Test Image',
                },
              },
            },
            brand: {
              data: {
                id: 2,
                attributes: {
                  name: 'Brand 2',
                },
              },
            },
          },
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 2,
        },
      },
    };

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(
      () =>
        useQuery(getProductsOptions({ pagination: { page: 1, pageSize: 10 } })),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(2);
    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products', method: 'GET' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockResolvedValueOnce(
      await createErrorResponse(400, 'Something went wrong').json()
    );

    const { result } = renderHook(
      () =>
        useQuery(getProductsOptions({ pagination: { page: 1, pageSize: 10 } })),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Something went wrong');
  });
});
