import { QueryParam } from '@/types/api/QueryParam';
import { toQueryString } from '../toQueryString/toQueryString';

interface FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
  queryParams?: QueryParam;
  apiRoute?: boolean;
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
  queryParams,
  apiRoute = false,
}: FetchOptions): Promise<T> => {
  const isFormData = body instanceof FormData;

  const headers = {
    accept: 'text/plain',
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const queryString = toQueryString(queryParams);
  const baseUrl = apiRoute ? '' : process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${baseUrl}${endpoint}${queryString}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.error) {
      throw new Error(data.error.message);
    }

    throw new Error(data.message);
  }

  return data;
};
