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
          sx={(theme) => ({
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { md: 'space-between' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            gap: { xs: 3, md: 6 },
            paddingTop: '80px',
            '@media screen and (min-width: 1200px) and (max-width: 1650px)': {
              padding: '60px 85px',
            },
            '@media (max-width: 1200px)': {
              // padding: '60px 30px',
              padding: '50px 100px',
              gap: '40px',
            },
            '@media (max-width: 1024px)': {
              flexDirection: 'column',
            },
            // '@media (max-width: 1200px)': {
            //   padding: '50px 100px',
            // },
            [theme.breakpoints.down('sm')]: {
              padding: '20px 30px',
            },
            maxWidth: '1600px',

            margin: '0 auto',
          })}
        >
          <Stack
            sx={{
              flex: 2,
              minWidth: 0,

              flexShrink: 1,
              '@media (max-width:600px)': {
                minWidth: '400px',
              },
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
            <Box>
              <Stack spacing={{ xs: 0, md: 4 }} alignItems="stretch">
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
              minWidth: { md: '300px' },
              maxWidth: { md: '350px' },
              flexShrink: 1,
              alignSelf: { xs: 'stretch', md: 'flex-start' },

              '@media (max-width:600px)': {
                minWidth: '450px',
              },
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
            <Box>
              <Stack direction="column">
                <CartSummary isCheckout={false} />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
}
