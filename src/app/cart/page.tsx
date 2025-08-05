'use client';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { Header } from '@/components/common/Header';
// import { useState } from 'react';
import { CartItem } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary';
// import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
// import { CartItemProps } from '@/components/CartItem/CartItem';
import { useCart } from '@/lib/hooks/useCart/useCart';
import { CartProduct } from '@/types/CartProduct';
import { FC } from 'react';
// import { useEffect } from 'react';

// import { Category } from '@mui/icons-material';
// import { CartProduct } from '@/types/CartProduct';
// import { Product } from '@/types/Product';
// import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

// interface Product {
//   id: number;
//   url: string;
//   attributes: {
//     name: string;
//     description: string;
//     price: number;
//     teamName: string;
//   };
// }

const Cart: FC<CartProduct> = () => {
  // const { value: quantities, setValue: setQuantities } = useLocalStorage<{
  //   [key: number]: number;
  // }>('cart-quantities', {});

  // const { value: products, setValue: setProducts } = useLocalStorage<Product[]>(
  //   'cart-products',
  //   []
  // );

  const { items, subtotal, handleIncrease, handleDecrease, handleDelete } =
    useCart();
  // const { value: products } = useLocalStorage<Product[]>('products', []);

  //to see data on the screen - delete in the future

  // useEffect(() => {
  //   // Only set localStorage if empty, to avoid overwriting user changes
  //   const existingCart = localStorage.getItem('cart-products');
  //   if (!existingCart) {
  //     fetch('https://shoes-shop-strapi.herokuapp.com/api/products')
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);

  //         localStorage.setItem('cart-products', JSON.stringify(data));
  //       });
  //   }
  // }, []);

  // const subtotal = items.reduce((acc, item) => {
  //   return acc + item.price * item.quantity;
  // }, 0);

  const total = subtotal;

  //  const handleIncrease = (id: number, currentQuantity: number) => {
  //    updateQuantity(id, currentQuantity + 1);
  //  };

  //  const handleDecrease = (id: number, currentQuantity: number) => {
  //    if (currentQuantity <= 1) return;
  //    updateQuantity(id, currentQuantity - 1);
  //  };

  //  const handleDelete = (id: number) => {
  //    remove(id);
  //  };

  // const mapProductToCartItemProps = (product: (typeof items)[number]) => ({
  //   id: product.id,
  //   images: product.image,
  //   name: product.name,
  //   inStock: true,
  //   price: product.price,
  //   quantity: product.quantity,
  //   category: String(product.size),
  //   onIncrease: () => handleIncrease(product.id, product.quantity),
  //   onDecrease: () => handleDecrease(product.id, product.quantity),
  //   onDelete: () => handleDelete(product.id),
  // });

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '80px 196px',
        }}
      >
        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Cart
          </Typography>
          <Box>
            <Stack direction="column" spacing={4} alignItems="stretch">
              {items && items.length > 0 ? (
                items
                  .filter((item) => item.quantity > 0)
                  .map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      images={item.images || []}
                      onIncrease={() => handleIncrease(item.id, item.quantity)}
                      onDecrease={() => handleDecrease(item.id, item.quantity)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty.
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider sx={{ margin: '60px 0' }} />
        </Stack>

        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Summary
          </Typography>

          <Box>
            <Stack direction="column">
              <CartSummary subtotal={subtotal} total={total} />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Cart;
