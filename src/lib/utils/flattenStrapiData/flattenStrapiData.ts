import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { StrapiResponse } from '@/types/api/StrapiResponse';

export function flattenStrapiData<T>(data: StrapiPaginatedData<T>): T[];
export function flattenStrapiData<T>(data: StrapiResponse<T>): T;
export function flattenStrapiData<T>(
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
