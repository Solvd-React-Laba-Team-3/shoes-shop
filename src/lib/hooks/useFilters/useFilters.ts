import { useCallback, useMemo } from 'react';
import {
  normalizeToUniqueArray,
  parseQueryString,
  toQueryString,
} from '@/lib/utils';
import { useSearchParams } from '../useSearchParams/useSearchParams';

type FilterType = number | number[] | string | Record<string, number | object>;

export const useFilters = () => {
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => {
    const raw = searchParams.get('filters');
    const parsed = raw ? parseQueryString(raw) : {};
    return parsed.filters ?? {};
  }, [searchParams]);

  const updateFilters = useCallback(
    (key: string, value?: FilterType) => {
      const raw = searchParams.get('filters');
      const parsed = raw ? parseQueryString(raw) : {};
      const current = parsed.filters ?? {};

      const updated = {
        ...current,
        [key]: value,
      };

      if (value === undefined) {
        delete updated[key];
      }

      searchParams.set('filters', toQueryString(updated, 'filters'));
    },
    [searchParams]
  );

  const clearFilters = useCallback(() => {
    searchParams.delete('filters');
  }, [searchParams]);

  const priceInput = useMemo<[number, number]>(
    () => [
      currentFilters?.price?.$gte || 1,
      currentFilters?.price?.$lte || 10000,
    ],
    [currentFilters?.price]
  );

  const toggleSelection = (key: string, checked: boolean, value?: number) => {
    {
      const existing = normalizeToUniqueArray(currentFilters[key]?.id?.$in);
      const updated = checked
        ? [...existing, value]
        : existing.filter((id: number) => id !== value);

      if (updated.length > 0) {
        updateFilters(key, { id: { $in: updated } });
        return;
      }
      updateFilters(key, undefined);
    }
  };

  return {
    currentFilters,
    updateFilters,
    clearFilters,
    priceInput,
    toggleSelection,
  };
};
