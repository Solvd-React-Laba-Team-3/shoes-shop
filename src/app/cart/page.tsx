'use client';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { Header } from '@/components/common/Header';
import { CartItem } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { useCart } from '@/lib/hooks/useCart/useCart';
import { FC } from 'react';

const Cart: FC = () => {
  const { items, subtotal, handleIncrease, handleDecrease, handleDelete } =
    useCart();

  const total = subtotal;
  console.log(items);

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
                      gender={item.gender}
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
