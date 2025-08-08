import { useLocalStorage } from '../useLocalStorage';

export const useWishlist = () => {
  const {
    value: items = [],
    setValue: setItems,
    isLoading,
  } = useLocalStorage<number[]>('wishlist', []);

  const addItem = (id: number) => {
    const updatedItems = Array.from(new Set([...items, id]));
    setItems(updatedItems);
  };

  const removeItem = (id: number) => {
    const updatedItems = items.filter((item) => item !== id);
    setItems(updatedItems);
  };

  return { items, addItem, removeItem, isLoading };
};
