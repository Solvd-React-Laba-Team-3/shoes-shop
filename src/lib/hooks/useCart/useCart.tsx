import { Product } from '@/types/Product';
import { useLocalStorage } from '../useLocalStorage';
import { CartProduct } from '@/types/CartProduct';

export const useCart = () => {
  const { value: items, setValue: setItems } = useLocalStorage<CartProduct[]>(
    'cart-products',
    []
  );

  const add = (product: Product, size: number) => {
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setItems(updatedItems);
      return;
    }
    const newProduct: CartProduct = {
      ...product,
      size,
      quantity: 1,
    };

    setItems((prev) => [...prev, newProduct]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    console.log('quantity is updated');

    if (quantity <= 0) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );

      return;
    }

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setItems(updatedItems);
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const handleIncrease = (id: number, quantity: number) => {
    updateQuantity(id, quantity + 1);
    console.log('increase btn is clicked');
  };

  const handleDecrease = (id: number, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
      console.log('decrease btn is clicked');
    }
  };

  const handleDelete = (id: number) => {
    remove(id);
  };

  return {
    items,
    add,
    updateQuantity,
    remove,
    subtotal,
    handleIncrease,
    handleDecrease,
    handleDelete,
  };
};
