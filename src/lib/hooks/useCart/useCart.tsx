import { CartProduct } from '@/types/CartProduct';
import { Product } from '@/types/Product';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import productImagePlaceholder from '../../../../public/product-placeholder.png';

export const useCart = () => {
  const {
    value: items,
    setValue: setItems,
    isLoading,
  } = useLocalStorage<CartProduct[]>('cart-products', []);

  const addItem = (product: Product, size: number) => {
    const newProduct: CartProduct = {
      ...product,
      size,
      image: product.images?.[0]?.url || productImagePlaceholder.src,
      quantity: 1,
      gender: product.gender.name,
      color: product.color.name,
    };

    const updatedItems = [...items, newProduct];
    setItems(updatedItems);
  };

  const updateQuantity = (id: number, size: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    );

    setItems(updatedItems);
  };

  const removeItem = (productId: number, size: number) => {
    const removedItems = items.filter(
      (item) => item.id !== productId || item.size !== size
    );
    setItems(removedItems);
  };

  const increaseQuantity = (id: number, size: number, quantity: number) => {
    updateQuantity(id, size, quantity + 1);
  };

  const decreaseQuantity = (id: number, size: number, quantity: number) => {
    updateQuantity(id, size, quantity - 1);
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return {
    items,
    addItem,
    updateQuantity,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    isLoading,
  };
};
