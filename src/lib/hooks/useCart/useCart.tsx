import { CartProduct } from '@/types/CartProduct';
import { Product } from '@/types/Product';
import { useState } from 'react';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';

export const useCart = () => {
  const { value: items, setValue: setItems } = useLocalStorage<CartProduct[]>(
    'cart-products',
    []
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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
      gender: product.gender.name,
      color: product.color.name,
    };

    const updatedItems = [...items, newProduct];
    setItems(updatedItems);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      setItems(updatedItems);

      return;
    }

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setItems(updatedItems);
  };

  const remove = (productId: number) => {
    const removedItems = items.filter((item) => item.id !== productId);
    setItems(removedItems);
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const handleIncrease = (id: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItems(updatedItems);
  };

  const handleDecrease = (id: number, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleDelete = (id: number) => {
    remove(id);
  };

  const onRequestDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    if (itemToDelete !== null) {
      handleDelete(itemToDelete);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const onCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
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
    deleteModalOpen,
    onCancelDelete,
    onConfirmDelete,
    onRequestDelete,
  };
};
