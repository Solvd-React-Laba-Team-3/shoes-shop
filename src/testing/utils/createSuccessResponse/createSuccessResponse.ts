import { MockResponse } from '../../types/mockResponse';

/**
 * Helper function to create a mock successful response
 * @param data The data to be returned in the response
 */
export const createSuccessResponse = <T>(data: T): MockResponse<T> => ({
  json: () => Promise.resolve(data),
  ok: true,
  status: 200,
  statusText: 'OK',
});
