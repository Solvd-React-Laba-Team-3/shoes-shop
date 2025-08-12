import { RECENTLTY_VIEWED_LIMIT } from '@/constants/recentlyViewedLimit';
import { useLocalStorage } from '../useLocalStorage';

export const useRecentlyViewed = () => {
  const {
    value: items = [],
    setValue: setItems,
    isLoading,
  } = useLocalStorage<number[]>('recently-viewed', []);

  const addItem = (id: number) => {
    setItems((prev) => {
      const next = [id, ...prev.filter((productId) => id !== productId)];
      return next.length > RECENTLTY_VIEWED_LIMIT
        ? next.slice(0, RECENTLTY_VIEWED_LIMIT)
        : next;
    });
  };

  return { items, addItem, isLoading };
};
