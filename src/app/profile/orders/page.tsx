'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrdersOptions } from '@/api/orders/getOrdersOptions';
import { Order } from '@/components/Order';
import { Box, Typography, Alert } from '@mui/material';
import { OrdersFallback } from '@/components/common/OrdersFallback';

export default function Orders() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery(getOrdersOptions());

  if (isError)
    return (
      <Box sx={{ mx: 'auto', p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Order History
        </Typography>
        <Alert severity="error">
          Error loading orders. Please try again later.
        </Alert>
      </Box>
    );

  return isLoading ? (
    <OrdersFallback />
  ) : (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order History
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 2 } }}
      >
        {orders.map((order) => (
          <Order key={order.orderNumber} order={order} />
        ))}
      </Box>
    </Box>
  );
}
