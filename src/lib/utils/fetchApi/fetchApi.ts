import { StrapiError } from '@/types/api/StrapiError';

interface FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
}

/**
 * Makes a fetch API request to the configured base URL with standardized headers.
 *
 * @template T - The expected successful response data type
 * @param {string} endpoint - The API endpoint path
 * @param {('GET'|'POST'|'PUT'|'DELETE')} method - The HTTP method to use
 * @param {unknown} [body] - Optional request body that will be JSON stringified
 * @param {string} [token] - Optional token to be used for authentication
 *
 * @returns {Promise<T | StrapiError>} A promise that resolves to either:
 *  - The successful response data of type T
 *  - A StrapiError object if the request fails
 */
export const fetchApi = async <T>({
  endpoint,
  method,
  body,
  token,
}: FetchOptions): Promise<T | StrapiError> => {
  const headers = {
    accept: 'text/plain',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  return response.json();
};
