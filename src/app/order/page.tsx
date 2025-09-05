'use client';

import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearchParams, useRouter } from 'next/navigation';
import orderImage from '../../../public/order.png';

export default function Order() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const order = searchParams.get('order');
  const theme = useTheme();
  const isXlScreen = useMediaQuery(theme.breakpoints.down('xl'));

  if (!order) {
    router.replace('/');
    return null;
  }

  const handleViewOrder = () => {
    router.replace('/profile/orders');
  };

  const handleContinueShopping = () => {
    router.replace('/');
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: { sm: 'space-evenly' },
          alignItems: { xs: 'center', xl: 'end' },
          padding: { xs: '80px 20px', sm: '80px' },
          flexDirection: { xs: 'column', xl: 'row' },
        }}
      >
        <Box>
          <Typography
            variant="h1"
            component={'h1'}
            sx={{ whiteSpace: 'nowrap' }}
          >
            THANK YOU
          </Typography>
          <Box
            display="flex"
            alignItems="baseline"
            gap={1}
            sx={{
              margin: '22px 0 40px 0',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Typography variant="h2" component="p" sx={{ fontWeight: 300 }}>
              for your order
            </Typography>
            <Typography component="p" variant="h2" color="primary.main">
              #{order}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            component={'p'}
            color="text.secondary"
            sx={{ marginBottom: '95px', maxWidth: '767px' }}
          >
            Your order has been received and is currently being processed. You
            will receive an email confirmation with your order details shortly.
          </Typography>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleViewOrder}
              sx={{
                width: { xs: '100%', xl: '250px' },
              }}
            >
              View Order
            </Button>

            <Button
              variant="contained"
              onClick={handleContinueShopping}
              sx={{
                width: { xs: '100%', xl: '250px' },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
        {!isXlScreen && (
          <Image
            src={orderImage}
            width={494}
            height={450}
            alt="Thank you"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </Box>
    </>
  );
}
