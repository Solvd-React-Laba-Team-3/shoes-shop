import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { getProductOptions } from './getProductOptions';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { ProductSingleResponse } from '@/types/api/ProductSingleResponse';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('getProductOptions', () => {
  it('fetches a single product successfully', async () => {
    const mockResponse: ProductSingleResponse = {
      data: {
        id: 123,
        attributes: {
          name: 'Single Product',
          description: 'Desc',
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
    };

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(() => useQuery(getProductOptions(123)), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data.id).toBe(123);
    expect(result.current.data?.data.attributes.name).toBe('Single Product');
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Not Found'));

    const { result } = renderHook(() => useQuery(getProductOptions(999)), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Not Found');
  });
});
