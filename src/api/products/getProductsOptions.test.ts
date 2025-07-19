import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { getProductsOptions } from './getProductsOptions';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { ProductAttributes } from '@/types/api/ProductAttributes';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('getProductsOptions', () => {
  it('fetches products successfully', async () => {
    const mockResponse: StrapiPaginatedData<ProductAttributes> = {
      data: [
        {
          id: 1,
          attributes: {
            name: 'Product 1',
            description: 'Desc 1',
            price: 100,
            teamName: 'team-1',
            images: {
              data: { id: 1, attributes: { url: '/img.jpg' } },
            },
            brand: {
              data: { id: 1, attributes: { name: 'Brand 1' } },
            },
          },
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 1,
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
    expect(result.current.data?.data).toHaveLength(1);
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Something went wrong'));

    const { result } = renderHook(
      () =>
        useQuery(getProductsOptions({ pagination: { page: 1, pageSize: 10 } })),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Something went wrong');
  });
});
