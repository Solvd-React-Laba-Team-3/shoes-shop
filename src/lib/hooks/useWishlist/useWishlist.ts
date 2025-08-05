import { useLocalStorage } from '../useLocalStorage';

export const useWishlist = () => {
  const { value: wishlist = [], setValue } = useLocalStorage<number[]>(
    'wishlist',
    []
  );

  const inWishlist = (id: number) => wishlist.includes(id);
  const add = (id: number) => setValue(Array.from(new Set([...wishlist, id])));
  const remove = (id: number) =>
    setValue(wishlist.filter((item) => item !== id));
  const toggle = (id: number) => (inWishlist(id) ? remove(id) : add(id));

  return { wishlist, inWishlist, add, remove, toggle };
};
