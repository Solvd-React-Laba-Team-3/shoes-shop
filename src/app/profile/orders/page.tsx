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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CartProduct } from '@/types/CartProduct';
import { useQuery } from '@tanstack/react-query';
import { getOrdersOptions } from '@/api/orders/getOrdersOptions';
import {
  Check,
  Close,
  Download,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Sync,
} from '@mui/icons-material';
import { Order } from '@/types/Order';
import { formatDate } from '@/lib/utils/formatDate/formatDate';
import { useState } from 'react';
import { IconButton } from '@/components/ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface StatusChipProps {
  status: string;
  declineReason?: string | null;
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return {
        color: '#317431ff',
        icon: <Check style={{ color: '#317431ff' }} />,
      };
    case 'requires_payment_method':
      return {
        color: '#303030ff',
        icon: <Sync style={{ color: '#303030ff' }} />,
      };
    case 'canceled':
      return {
        color: '#c62828',
        icon: <Close style={{ color: '#c62828' }} />,
      };
    default:
      return {
        color: '#f5f5f5',
        icon: <InfoOutlinedIcon style={{ color: '#f5f5f5' }} />,
      };
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return 'Received';
    case 'requires_payment_method':
      return 'In Progress';
    case 'canceled':
      return 'Cancelled';
    default:
      return 'Incomplete';
  }
};

const StatusChip = ({ status }: StatusChipProps) => {
  const theme = useTheme();
  const statusInfo = getStatusStyles(status);

  return (
    <Chip
      icon={statusInfo.icon}
      label={getStatusLabel(status)}
      sx={{
        backgroundColor: 'inherit',
        color: statusInfo.color,
        ...theme.typography.caption,
        textTransform: 'capitalize',
        fontWeight: 500,
        '.MuiChip-label': {
          display: { xs: 'none', lg: 'block' },
        },
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

  const [expanded, setExpanded] = useState<number | null>(null);

  const handleExpandClick = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const theme = useTheme();
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

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
    <Box sx={{ maxWidth: 1480, pb: 10 }}>
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
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  paddingLeft: '24px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: { md: '200px' },
                  }}
                >
                  <Typography variant="caption">
                    <strong>N°{order.orderNumber}</strong>
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[600], fontWeight: 400 }}
                    >
                      {formatDate(order.date)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'none', lg: 'flex' },
                    justifyContent: 'center',
                  }}
                >
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
                    justifyContent: 'space-between',
                    width: { lg: '320px' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.grey[600],
                      fontWeight: 400,
                      flex: 1,
                    }}
                  >
                    {!isBetweenMdAndLg && !isBetweenXsAndSm ? 'Summary: ' : ''}
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
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex', lg: 'none' },
                      justifyContent: 'space-between',
                      py: 1,
                      px: 2,
                      gap: 3,
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    <Typography variant="h5" sx={{ flex: 0.75 }}>
                      Product
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ flex: 0.15, textAlign: 'right' }}
                    >
                      Qty.
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ flex: 0.15, mr: 2, textAlign: 'right' }}
                    >
                      Price
                    </Typography>
                  </Box>
                  {order.products.map((product: CartProduct, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: { xs: 'wrap', lg: 'nowrap' },
                        p: 2,
                        gap: 3,
                        backgroundColor: 'inherit',
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flex: { xs: 1, sm: 0.7, lg: 1.25 },
                        }}
                      >
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          variant="rounded"
                          sx={{
                            width: { xs: 110, default: 80 },
                            height: { xs: 110, default: 80 },
                          }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h5">{product.name}</Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              display: { xs: 'none', sm: 'block' },
                              color: theme.palette.grey[600],
                            }}
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
                              component="span"
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.secondary.main,
                              }}
                            >
                              {product.size} UK
                            </Typography>
                          </Typography>

                          <Box
                            sx={{
                              display: { xs: 'flex', sm: 'none' },
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.grey[600],
                              }}
                            >
                              Price:{' '}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  fontWeight: 500,
                                  color: theme.palette.secondary.main,
                                }}
                              >
                                {product.price}$
                              </Typography>
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.grey[600],
                              }}
                            >
                              Quantity:{' '}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  fontWeight: 500,
                                  color: theme.palette.secondary.main,
                                }}
                              >
                                {product.quantity}
                              </Typography>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {!isBetweenXsAndSm && (
                        <>
                          <Box
                            sx={{
                              flex: { xs: 0.15, lg: 1 },
                              textAlign: { xs: 'left', lg: 'center' },
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: theme.palette.grey[600],
                                textAlign: 'right',
                              }}
                            >
                              {!isBetweenMdAndLg ? 'Quantity: ' : ''}
                              <Typography
                                component="span"
                                variant="subtitle1"
                                sx={{ color: theme.palette.secondary.main }}
                              >
                                {product.quantity}
                              </Typography>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              flex: { xs: 0.15, lg: 1 },
                              textAlign: 'right',
                              mr: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ color: theme.palette.grey[600] }}
                            >
                              {!isBetweenMdAndLg ? 'Price: ' : ''}
                              <Typography
                                component="span"
                                variant="subtitle1"
                                sx={{ color: theme.palette.secondary.main }}
                              >
                                {product.price}$
                              </Typography>
                            </Typography>
                          </Box>
                        </>
                      )}
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
                          PDF {!isBetweenXsAndSm && 'invoice download'}
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
