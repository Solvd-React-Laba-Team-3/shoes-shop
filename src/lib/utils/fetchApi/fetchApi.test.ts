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
});
