import { renderHook, act } from '@testing-library/react';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { DeleteProductResponse, useDeleteProduct } from './useDeleteProduct';
import {
  createErrorResponse,
  createSuccessResponse,
  createWrapper,
} from '@/testing/utils';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useDeleteProduct', () => {
  it('deletes a product successfully', async () => {
    const mockResponse: DeleteProductResponse = {};

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: 1, token: 'mock-token' });
    });

    expect(result.current.isSuccess).toBe(true);
    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products/1', method: 'DELETE' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockResolvedValueOnce(
      await createErrorResponse(404, 'Not Found').json()
    );

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        id: 999,
        token: 'mock-token',
      });
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toContain('Not Found');
  });
});
