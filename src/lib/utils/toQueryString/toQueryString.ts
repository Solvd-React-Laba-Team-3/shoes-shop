import { QueryParam } from '@/types/api/QueryParam';

/**
 * Converts an object of query parameters into a URL-encoded query string.
 *
 * @param {Record<string, string | number | boolean>} [queryParams] - The query parameters to convert
 * @returns {string} The URL-encoded query string, starting with '?' if parameters exist, otherwise an empty string
 */
export const toQueryString = (
  queryParams?: QueryParam,
  rootKey?: string
): string => {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return '';
  }

  const buildParams = (obj: QueryParam, prefix = ''): string[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const paramKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        if (value.length === 0) return [];
        return value.map(
          (v) =>
            `${encodeURIComponent(paramKey)}=${encodeURIComponent(String(v))}`
        );
      } else if (typeof value === 'object' && value !== null) {
        return buildParams(value as QueryParam, paramKey);
      } else if (value !== undefined && value !== null && value !== '') {
        return `${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`;
      } else {
        return [];
      }
    });
  };

  const root = rootKey ? { [rootKey]: queryParams } : queryParams;

  const params = buildParams(root).join('&');
  return params ? `?${params}` : '';
};
