import { StrapiError } from '@/types/api/StrapiError';
import { MockResponse } from '../../types/mockResponse';

/**
 * Helper function to create a mock error response
 * @param status HTTP status code
 * @param message Error message
 * @param details Additional error details
 */

export const createErrorResponse = (
  status: number = 400,
  message: string = 'Bad Request',
  details: Record<string, unknown> = {}
): MockResponse<StrapiError> => ({
  json: () =>
    Promise.resolve({
      error: {
        status,
        name: message,
        message,
        details,
      },
    }),
  ok: false,
  status,
  statusText: message,
});
