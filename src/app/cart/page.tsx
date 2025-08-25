'use client';

import { CartItem } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { CartFallback } from '@/components/common/CartFallback';
import { Header } from '@/components/common/Header';
import { useCart } from '@/lib/hooks';
import { Box, Stack, styled, Typography } from '@mui/material';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '60px 85px',
  gap: '48px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 30px',
    gap: '24px',
  },
  [theme.breakpoints.down('xl')]: {
    flexDirection: 'column',
  },
  maxWidth: '1600px',
  margin: '0 auto',
}));

export default function Cart() {
  const { items, isLoading } = useCart();

  return (
    <>
      <Header />
      {isLoading ? (
        <CartFallback />
      ) : (
        <StyledContainer>
          <Stack
            sx={{
              flex: 2,
              minWidth: 0,
              flexShrink: 1,
              width: { xs: '100%', xl: '700px' },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
              }}
            >
              Cart
            </Typography>
            <Stack alignItems="stretch" sx={{ gap: { xs: 1.5, sm: 3, md: 4 } }}>
              {items.length > 0 ? (
                items.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size}`}
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
          </Stack>

          <Stack
            sx={{
              flex: '0 0 auto',
              width: { xs: '100%', xl: '400px' },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
              }}
            >
              Summary
            </Typography>
            <CartSummary checkout={false} />
          </Stack>
        </StyledContainer>
      )}
    </>
  );
}
