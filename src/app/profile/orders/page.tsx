'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrdersOptions } from '@/api/orders/getOrdersOptions';
import { Order } from '@/components/Order';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  styled,
} from '@mui/material';
import { OrdersFallback } from '@/components/common/OrdersFallback';
import { useIntersectionObserver } from '@/lib/hooks';
import { EmptyContent } from '@/components/EmptyContent';
import AccessTimeIcon from '@mui/icons-material/AccessTimeFilled';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

const StyledAccessTimeIcon = styled(AccessTimeIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

export default function Orders() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getOrdersOptions());

  const { ref: lastOrderRef } = useIntersectionObserver({
    rootMargin: '100px',
    onChange: (intersecting) => {
      if (intersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const orders = data?.pages.flatMap((page) => page.orders) ?? [];

  if (isError)
    return (
      <Box sx={{ mx: 'auto', p: 3 }}>
        <Typography
          variant="h5"
          component={'h1'}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Order History
        </Typography>
        <Alert severity="error">
          Error loading orders. Please try again later.
        </Alert>
      </Box>
    );

  return isLoading ? (
    <OrdersFallback />
  ) : orders.length > 0 ? (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h5" component={'h1'} sx={{ mb: 3 }}>
        Order History
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 2 } }}
      >
        {orders.map((order, index) => (
          <Box
            key={order.orderNumber}
            ref={index === orders.length - 1 ? lastOrderRef : null}
          >
            <Order order={order} />
          </Box>
        ))}

        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Button
              variant="outlined"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load More Orders
            </Button>
          </Box>
        )}

        {!hasNextPage && orders.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Typography variant="body2" component={'p'} color="text.secondary">
              No more orders to load..
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <EmptyContent
      icon={<StyledAccessTimeIcon />}
      message="You don't have any orders yet."
      caption="Start shopping to see your order history."
    >
      <Button size="small" onClick={() => router.push('/')}>
        Go to Catalog
      </Button>
    </EmptyContent>
  );
}
