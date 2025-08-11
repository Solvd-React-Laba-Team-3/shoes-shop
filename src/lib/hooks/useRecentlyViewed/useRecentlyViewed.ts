import { useLocalStorage } from '../useLocalStorage';

export const useRecentlyViewed = () => {
  const {
    value: items = [],
    setValue: setItems,
    isLoading,
  } = useLocalStorage<number[]>('recently-viewed', []);

  const MAX_ITEMS = 12;

  const addItem = (id: number) => {
    setItems((prev) => {
      const next = [id, ...prev.filter((productId) => id !== productId)];
      return next.length > MAX_ITEMS ? next.slice(0, MAX_ITEMS) : next;
    });
  };

  return { items, addItem, isLoading };
};
