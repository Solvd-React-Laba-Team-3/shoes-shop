'use client';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { Header } from '@/components/common/Header';
import { useState } from 'react';
import { CartItem } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface Product {
  id: number;
  url: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    teamName: string;
  };
}

const Cart = () => {
  const { value: quantities, setValue: setQuantities } = useLocalStorage<{
    [key: number]: number;
  }>('cart-quantities', {});

  const [products] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];

    const raw = localStorage.getItem('cart-products');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Error parsing cart-products from localStorage:', error);
      return [];
    }
  });

  //to see data on the screen - delete in the future
  fetch('https://shoes-shop-strapi.herokuapp.com/api/products')
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('cart-products', JSON.stringify(data.data));
    });

  const subtotal = products.reduce((acc, product) => {
    const quantity = quantities[product.id] || 0;
    return acc + product.attributes.price * quantity;
  }, 0);

  const total = subtotal;

  const handleIncrease = (id: number) => {
    setQuantities({ ...quantities, [id]: (quantities[id] || 0) + 1 });
  };

  const handleDecrease = (id: number) => {
    if (quantities[id] <= 1) return;
    setQuantities({ ...quantities, [id]: quantities[id] - 1 });
  };

  const handleDelete = (id: number) => {
    const newQuantities = { ...quantities };
    delete newQuantities[id];
    setQuantities(newQuantities);
  };

  const mapProductToCartItemProps = (product: Product) => ({
    images: product.url,
    name: product.attributes.name,
    category: product.attributes.teamName,
    inStock: true,
    price: product.attributes.price,
    quantity: quantities[product.id] || 0,
    onIncrease: () => handleIncrease(product.id),
    onDecrease: () => handleDecrease(product.id),
    onDelete: () => handleDelete(product.id),
  });

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
              {products.map((product) => (
                <CartItem
                  key={product.id}
                  {...mapProductToCartItemProps(product)}
                />
              ))}
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
