type QueryParam = Record<
  string,
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<string | number | boolean>
>;
interface FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
  queryParams?: QueryParam;
}

/**
 * Converts an object of query parameters into a URL-encoded query string.
 *
 * @param {Record<string, string | number | boolean>} [queryParams] - The query parameters to convert
 * @returns {string} The URL-encoded query string, starting with '?' if parameters exist, otherwise an empty string
 */
function toQueryString(queryParams?: QueryParam): string {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return '';
  }

  function buildParams(obj: QueryParam, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([key, value]) => {
      const paramKey = prefix ? `${prefix}[${key}]` : key;
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return buildParams(value as QueryParam, paramKey);
      } else if (Array.isArray(value)) {
        return value.map(
          (v) =>
            `${encodeURIComponent(paramKey)}[]=${encodeURIComponent(String(v))}`
        );
      } else {
        return `${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`;
      }
    });
  }

  const params = buildParams(queryParams).join('&');
  return params ? `?${params}` : '';
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
}: FetchOptions): Promise<T> => {
  const headers = {
    accept: 'text/plain',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const queryString = toQueryString(queryParams);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${queryString}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  return response.json();
};
