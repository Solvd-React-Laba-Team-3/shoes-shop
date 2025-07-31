import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiResponse } from '@/types/api/StrapiResponse';

/**
 * Flattens Strapi's nested data structure by combining id and attributes into a single object
 *
 * @template T - The type of the flattened data
 * @param data - The Strapi response data to flatten
 * @returns For paginated data, returns an array of flattened objects. For single items, returns a flattened object
 *
 * @example
 * // Single item
 * flatStrapiData({ id: 1, attributes: { name: 'Shoe' } })
 * // Returns: { id: 1, name: 'Shoe' }
 *
 * @example
 * // Paginated data
 * flatStrapiData({ data: [{ id: 1, attributes: { name: 'Shoe' } }] })
 * // Returns: [{ id: 1, name: 'Shoe' }]
 */
export function flatStrapiData<T>(data: StrapiPaginatedData<T>): T[];
export function flatStrapiData<T>(data: StrapiResponse<T>): T;
export function flatStrapiData<T>(
  data: StrapiPaginatedData<T> | StrapiResponse<T>
): T | T[] {
  if ('data' in data && Array.isArray(data.data)) {
    return data.data.map((item) => {
      return { id: item.id, ...item.attributes } as T;
    });
  }

  if ('attributes' in data && typeof data.attributes === 'object') {
    return { id: data.id, ...data.attributes };
  }

  return {} as T;
}
