'use client';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Order() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const order = searchParams.get('order');

  const handleViewOrder = () => {
    router.push('/products');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'end',
          paddingTop: '80px',
        }}
      >
        <Box>
          <Typography variant="h1">THANK YOU</Typography>
          <Box
            display="flex"
            alignItems="baseline"
            gap={1}
            sx={{ margin: '45px 0 77px 0' }}
          >
            <Typography variant="h2" component="span" sx={{ fontWeight: 300 }}>
              for your order
            </Typography>
            <Typography component="span" variant="h2" color="primary.main">
              #{order ?? '9082372'}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: '95px', maxWidth: '767px' }}
          >
            Your order has been received and is currently being processed. You
            will receive an email confirmation with your order details shortly.
          </Typography>

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={handleViewOrder}>
              View Order
            </Button>

            <Button variant="contained" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
          </Box>
        </Box>

        <Image
          src="/order.png"
          width={494}
          height={450}
          alt="Thank you"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
    </>
  );
}
