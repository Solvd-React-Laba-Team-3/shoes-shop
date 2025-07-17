import { fetchApi } from './fetchApi';
import { createSuccessResponse, createErrorResponse } from '@/testing/utils';

process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

describe('fetchApi', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should make a GET request with correct URL and headers', async () => {
    const mockResponse = { data: 'test' };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const result = await fetchApi<typeof mockResponse>({
      endpoint: '/test',
      method: 'GET',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          accept: 'text/plain',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should make a POST request with body', async () => {
    const requestBody = { name: 'test' };
    const mockResponse = { id: 1, ...requestBody };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const result = await fetchApi<typeof mockResponse>({
      endpoint: '/test',
      method: 'POST',
      body: requestBody,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          accept: 'text/plain',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(requestBody),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should include authorization header when token is provided', async () => {
    const mockResponse = { data: 'test' };
    const token = 'test-token';
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const result = await fetchApi<typeof mockResponse>({
      endpoint: '/test',
      method: 'GET',
      token,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle PUT requests', async () => {
    const requestBody = { name: 'updated' };
    const mockResponse = { id: 1, ...requestBody };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const result = await fetchApi<typeof mockResponse>({
      endpoint: '/test/1',
      method: 'PUT',
      body: requestBody,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test/1`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(requestBody),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle DELETE requests', async () => {
    const mockResponse = { success: true };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const result = await fetchApi<typeof mockResponse>({
      endpoint: '/test/1',
      method: 'DELETE',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test/1`,
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle error responses', async () => {
    const errorStatus = 400;
    const errorMessage = 'Invalid data';
    fetchMock.mockResolvedValueOnce(
      createErrorResponse(errorStatus, errorMessage)
    );

    await expect(
      fetchApi<{ data: string }>({
        endpoint: '/test',
        method: 'GET',
      })
    ).resolves.toEqual({
      error: {
        status: errorStatus,
        name: errorMessage,
        message: errorMessage,
        details: {},
      },
    });
  });

  it('should append simple query parameters to the URL', async () => {
    const mockResponse = { data: 'with-query' };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const queryParams = { foo: 'bar', num: 42, bool: true };
    await fetchApi<typeof mockResponse>({
      endpoint: '/test',
      method: 'GET',
      queryParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/test?foo=bar&num=42&bool=true`,
      expect.any(Object)
    );
  });

  it('should append array query parameters to the URL', async () => {
    const mockResponse = { data: 'with-array-query' };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const queryParams = {
      ids: [1, 2, 3],
      tags: ['new', 'sale'],
      flags: [true, false],
    };
    await fetchApi<typeof mockResponse>({
      endpoint: '/items',
      method: 'GET',
      queryParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `${process.env.NEXT_PUBLIC_API_URL}/items?ids[]=1&ids[]=2&ids[]=3&tags[]=new&tags[]=sale&flags[]=true&flags[]=false`
      ),
      expect.any(Object)
    );
  });

  it('should append nested arrays in query parameters to the URL', async () => {
    const mockResponse = { data: 'with-nested-array-query' };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const queryParams = {
      filter: {
        categories: ['shoes', 'boots'],
        prices: [10, 20],
      },
      sort: 'asc',
    };
    await fetchApi<typeof mockResponse>({
      endpoint: '/products',
      method: 'GET',
      queryParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `${process.env.NEXT_PUBLIC_API_URL}/products?filter%5Bcategories%5D[]=shoes&filter%5Bcategories%5D[]=boots&filter%5Bprices%5D[]=10&filter%5Bprices%5D[]=20&sort=asc`
      ),
      expect.any(Object)
    );
  });

  it('should append nested object query parameters to the URL', async () => {
    const mockResponse = { data: 'with-nested-query' };
    fetchMock.mockResolvedValueOnce(createSuccessResponse(mockResponse));

    const queryParams = {
      filter: {
        name: 'shoes',
        price: { gte: 10, lte: 100 },
      },
      sort: 'desc',
    };
    await fetchApi<typeof mockResponse>({
      endpoint: '/products',
      method: 'GET',
      queryParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `${process.env.NEXT_PUBLIC_API_URL}/products?filter%5Bname%5D=shoes&filter%5Bprice%5D%5Bgte%5D=10&filter%5Bprice%5D%5Blte%5D=100&sort=desc`
      ),
      expect.any(Object)
    );
  });
});
