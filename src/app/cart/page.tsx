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
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { md: 'space-between' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            gap: { xs: 3, sm: 4, md: 6, lg: 8 },
            padding: {
              xs: '16px',
              sm: '24px',
              md: '48px 64px',
              lg: '80px 196px',
            },
          }}
        >
          <Stack sx={{ flex: 2, width: '100%' }}>
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              }}
            >
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
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textAlign: { xs: 'center', md: 'left' } }}
                  >
                    Your cart is empty.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '350px' },
              position: { md: 'sticky' },
              top: { md: '100px' },
              alignSelf: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
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
