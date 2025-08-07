'use client';

import { CartItem } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { CartFallback } from '@/components/common/CartFallback';
import { Header } from '@/components/common/Header';
import { useCart } from '@/lib/hooks';
import { Box, Stack, Typography } from '@mui/material';

export default function Cart() {
  const { items, isLoading } = useCart();

  return (
    <>
      <Header />
      {isLoading ? (
        <CartFallback />
      ) : (
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
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      gender={item.gender}
                      image={item.image}
                    />
                  ))
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    Your cart is empty.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack>
            <Typography variant="h2" sx={{ marginBottom: '32px' }}>
              Summary
            </Typography>

            <Box>
              <Stack direction="column">
                <CartSummary />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
}
