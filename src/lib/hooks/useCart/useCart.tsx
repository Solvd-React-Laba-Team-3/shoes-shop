import { useLocalStorage } from '../useLocalStorage';
import { CartProduct } from '@/types/CartProduct';

export const useCart = () => {
  const { value: items, setValue: setItems } = useLocalStorage<CartProduct[]>(
    'cart-products',
    []
  );

  const add = (product: Omit<CartProduct, 'quantity'>) => {
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setItems(updatedItems);
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedItems = items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setItems(updatedItems);
  };

  const remove = (productId: number) => {
    const updatedItems = items.filter((item) => item.id !== productId);
    setItems(updatedItems);
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const handleIncrease = (id: number, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: number, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
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
