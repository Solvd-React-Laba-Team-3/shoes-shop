import { CartProduct } from '@/types/CartProduct';
import { Product } from '@/types/Product';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import productImagePlaceholder from '../../../../public/product-placeholder.png';

interface CartState {
  products: CartProduct[];
  discountCode?: string;
  discountAmount?: number;
}

export const useCart = () => {
  const {
    value: cartState,
    setValue: setCartState,
    isLoading,
  } = useLocalStorage<CartState>('cart-state', { products: [] });

  const items = cartState.products;

  const addItem = (product: Product, size: number) => {
    const newProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      image: product.images?.[0]?.url || productImagePlaceholder.src,
      quantity: 1,
      gender: product.gender.name,
      color: product.color.name,
    };

    setCartState({ ...cartState, products: [...items, newProduct] });
  };

  const updateQuantity = (id: number, size: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    );

    setCartState({ ...cartState, products: updatedItems });
  };

  const removeItem = (productId: number, size: number) => {
    const removedItems = items.filter(
      (item) => item.id !== productId || item.size !== size
    );
    setCartState({ ...cartState, products: removedItems });
  };

  const increaseQuantity = (id: number, size: number, quantity: number) => {
    updateQuantity(id, size, quantity + 1);
  };

  const decreaseQuantity = (id: number, size: number, quantity: number) => {
    updateQuantity(id, size, quantity - 1);
  };

  const setDiscount = (code?: string, amount?: number) => {
    setCartState({ ...cartState, discountCode: code, discountAmount: amount });
  };

  const clearDiscount = () => {
    setCartState({
      ...cartState,
      discountCode: undefined,
      discountAmount: undefined,
    });
  };

  const clearCart = () => {
    setCartState({
      ...cartState,
      products: [],
      discountCode: undefined,
      discountAmount: undefined,
    });
  };

  const subtotal = isLoading
    ? 0
    : items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

  return {
    items,
    subtotal,
    discountCode: cartState.discountCode,
    discountAmount: cartState.discountAmount ?? 0,
    addItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    setDiscount,
    clearDiscount,
    clearCart,
    isLoading,
  };
};
