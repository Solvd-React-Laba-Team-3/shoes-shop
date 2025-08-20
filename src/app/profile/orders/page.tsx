'use client';

import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Link,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CartProduct } from '@/types/CartProduct';
import { useQuery } from '@tanstack/react-query';
import { getOrdersOptions } from '@/api/orders/getOrdersOptions';
import {
  Download,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Order } from '@/types/Order';
import { theme } from '@/providers/ThemeProvider';
import { formatDate } from '@/lib/utils/formatDate/formatDate';
import { useState } from 'react';
import { IconButton } from '@/components/ui';

interface StatusChipProps {
  status: string;
  declineReason?: string | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return { backgroundColor: '#317431ff', color: '#ffffffff' };
    case 'requires_payment_method':
      return { backgroundColor: '#303030ff', color: '#ffffffff' };
    case 'canceled':
      return { backgroundColor: '#c62828', color: '#ffffffff' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#424242' };
  }
};

const getStatusLabel = (status: string, declineReason: string | null) => {
  const declineMessages: { [key: string]: string } = {
    generic_decline: 'Generic decline',
    insufficient_funds: 'Insufficient funds',
    card_declined: 'Card declined',
    stolen_card: 'Card stolen',
    lost_card: 'Card lost',
    incorrect_number: 'Incorrect card number',
    expired_card: 'Card expired',
  };

  if (status.toLowerCase() === 'requires_payment_method') {
    if (declineReason) {
      return declineMessages[declineReason] || `Rejected (${declineReason})`;
    }
    return 'Incomplete';
  }

  return status;
};

const StatusChip = ({ status, declineReason }: StatusChipProps) => {
  return (
    <Chip
      label={getStatusLabel(status, declineReason || null)}
      sx={{
        ...getStatusColor(status),
        ...theme.typography.caption,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default function Orders() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery(getOrdersOptions());

  console.log('Orders:', orders);

  const [expanded, setExpanded] = useState<number | null>(null);

  const handleExpandClick = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Order History
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ p: 3 }}>
              <Skeleton variant="text" width="25%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Order History
        </Typography>
        <Alert severity="error">
          Error loading orders. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1480, p: 3, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order History
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders.map((order: Order, index: number) => (
          <Card
            key={`${order.orderNumber}-${index}`}
            sx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.grey[100],
                borderBottom: '1px solid ' + theme.palette.grey[300],
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  padding: '0 24px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption">
                    <strong>N°{order.orderNumber}</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                    >
                      {formatDate(order.date)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                  >
                    Products{' '}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                      }}
                    >
                      {order.products.length}
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                  >
                    Summary:{' '}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                      }}
                    >
                      {order.summary}$
                    </Typography>
                  </Typography>
                  <StatusChip
                    status={order.status}
                    declineReason={order.decline_reason}
                  />
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded === index}
                    aria-label="show more"
                  >
                    {expanded === index ? (
                      <KeyboardArrowUp
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    ) : (
                      <KeyboardArrowDown
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Collapse in={expanded === index} timeout="auto" unmountOnExit>
              <CardContent
                sx={{
                  backgroundColor: theme.palette.grey[100],
                  width: '100%',
                  padding: 0,
                  '&:last-child': {
                    paddingBottom: 0,
                  },
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    borderBottom: '1px solid ' + theme.palette.grey[300],
                    justifyContent: 'center',
                    gap: '40px',
                    alignItems: 'center',
                    padding: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                    >
                      Delivery:{' '}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontWeight: 400,
                        }}
                      >
                        {order.delivery}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                    >
                      Contacts:{' '}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontWeight: 400,
                        }}
                      >
                        {order.contactFullName}, {order.contactPhone},{' '}
                        {order.contactEmail}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                    >
                      Payment:{' '}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{
                            color: theme.palette.secondary.main,
                            fontWeight: 400,
                          }}
                        >
                          {order.paymentMethod}
                        </Typography>
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderBottom: '1px solid ' + theme.palette.grey[300],
                  }}
                >
                  {order.products.map((product: CartProduct, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        backgroundColor: 'inherit',
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flex: 1,
                        }}
                      >
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                        <Box>
                          <Typography variant="h5">{product.name}</Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.grey[600] }}
                          >
                            {product.gender == 'Men'
                              ? "Men's Shoes"
                              : "Women's Shoes"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.grey[600],
                            }}
                          >
                            Size:{' '}
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.secondary.main,
                              }}
                            >
                              {product.size} UK
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ minWidth: 500, maxWidth: 500, textAlign: 'left' }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.grey[600] }}
                        >
                          Quantity:{' '}
                          <Typography
                            component="span"
                            variant="subtitle2"
                            sx={{ color: theme.palette.secondary.main }}
                          >
                            {product.quantity}
                          </Typography>
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          minWidth: 100,
                          maxWidth: 100,
                          textAlign: 'right',
                          mr: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.grey[600] }}
                        >
                          Price:{' '}
                          <Typography
                            component="span"
                            variant="subtitle1"
                            sx={{ color: theme.palette.secondary.main }}
                          >
                            {product.price}$
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ml: 4,
                    mr: 4,
                    padding: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight:
                        order.discountAmount || order.receipt_url ? '56px' : 0,
                    }}
                  >
                    {order.receipt_url && (
                      <Link
                        href={order.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          textDecoration: 'underline',
                          fontWeight: 500,
                        }}
                      >
                        <Download
                          sx={{ fontSize: theme.typography.subtitle2 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          PDF invoice download
                        </Typography>
                      </Link>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    {order.discountAmount && (
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.grey[600] }}
                      >
                        Discount:{' '}
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ display: 'inline', color: '#EB5656' }}
                        >
                          {order.discountAmount}$
                        </Typography>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
