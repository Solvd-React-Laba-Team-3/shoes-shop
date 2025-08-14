import { Response } from '../../types/Response';

/**
 * Helper function to create a mock successful response
 * @param data The data to be returned in the response
 */
export const createSuccessResponse = <T>(data: T): Response<T> => ({
  json: () => Promise.resolve(data),
  ok: true,
  status: 200,
  statusText: 'OK',
});
