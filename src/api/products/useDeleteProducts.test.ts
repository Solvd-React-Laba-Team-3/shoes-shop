import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchApi } from '@/lib/utils/fetchApi/fetchApi';
import { DeleteProductResponse, useDeleteProduct } from './useDeleteProduct';
import { createSuccessResponse, createWrapper } from '@/testing/utils';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('useDeleteProduct', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper(); // fresh QueryClient per test
  });

  it('deletes a product successfully', async () => {
    const mockResponse: DeleteProductResponse = {};

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: 1, token: 'mock-token' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedFetchApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/products/1', method: 'DELETE' })
    );
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Not Found'));

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: 999, token: 'mock-token' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('Not Found');
  });
});
