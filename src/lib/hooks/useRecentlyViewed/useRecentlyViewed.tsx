import { RECENTLY_VIEWED_LIMIT } from '@/constants/recentlyViewedLimit';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';

export const useRecentlyViewed = () => {
  const {
    value: items = [],
    setValue: setItems,
    isLoading,
  } = useLocalStorage<number[]>('recently-viewed', []);

  const addItem = (id: number) => {
    setItems((prev) => {
      const next = [id, ...prev.filter((productId) => id !== productId)];
      return next.length > RECENTLY_VIEWED_LIMIT
        ? next.slice(0, RECENTLY_VIEWED_LIMIT)
        : next;
    });
  };

  return { items, addItem, isLoading };
};
