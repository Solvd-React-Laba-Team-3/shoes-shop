/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parses a URL query string into a nested object.
 *
 * Supports bracket notation for nesting (e.g. `filter[user][id]=1`) and
 * comma-separated values for arrays (e.g. `tags=react,nextjs`).
 *
 * @param queryString - The URL query string to parse. Can start with '?' or not.
 * @returns A nested object representation of the query parameters.
 *
 * @example
 * parseQueryStringToObject('?filter[user][id]=1&tags=react,nextjs')
 * // => { filter: { user: { id: '1' } }, tags: ['react', 'nextjs'] }
 */

export function parseQueryString(queryString: string): Record<string, any> {
  const params = new URLSearchParams(
    queryString.startsWith('?') ? queryString.slice(1) : queryString
  );
  const result: Record<string, any> = {};

  for (const [key, value] of params.entries()) {
    const keys = key.split(/\[|\]/).filter(Boolean);
    let current = result;

    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        if (value.includes(',')) {
          current[k] = value.split(',');
        } else {
          current[k] = value;
        }
      } else {
        if (!current[k]) current[k] = {};
        current = current[k];
      }
    });
  }

  return result;
}
