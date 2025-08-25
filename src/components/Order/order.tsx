'use client';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Link,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  Check,
  Close,
  Download,
  InventoryTwoTone,
  LocalShippingTwoTone,
  PaymentsTwoTone,
  PersonSearchTwoTone,
  Sync,
} from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Accordion } from '@/components/ui';
import {
  StyledLabelWrapper,
  StyledTooltipContent,
  StyledProductWrapper,
  StyledChip,
  StyledToolsWrapper,
  StyledOrderInfo,
  StyledInfoGrid,
} from './order.styles';
import { Order as OrderType } from '@/types/Order';
import { useDownloadReceipt } from '@/api/receipts/getReceiptsOptions';
import { formatDate } from '@/lib/utils/';
import { FC } from 'react';
import { Theme } from '@mui/material/styles';
interface OrderProps {
  order: OrderType;
}

const getStatus = (status: string, theme: Theme) => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return {
        label: 'Received',
        color: theme.palette.success.main,
        icon: <Check style={{ color: theme.palette.success.main }} />,
      };
    case 'requires_payment_method':
      return {
        label: 'In Progress',
        color: theme.palette.grey[900],
        icon: <Sync style={{ color: theme.palette.grey[900] }} />,
      };
    case 'canceled':
      return {
        label: 'Cancelled',
        color: theme.palette.error.main,
        icon: <Close style={{ color: theme.palette.error.main }} />,
      };
    default:
      return {
        label: 'Incomplete',
        color: theme.palette.grey[300],
        icon: <InfoOutlinedIcon style={{ color: theme.palette.grey[300] }} />,
      };
  }
};

export const Order: FC<OrderProps> = ({ order }) => {
  const theme = useTheme();
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const downloadReceiptMutation = useDownloadReceipt();

  const handleDownload = () => {
    if (!order.latest_charge) return;

    downloadReceiptMutation.mutate({
      chargeId: order.latest_charge,
      orderNumber: String(order.orderNumber),
    });
  };

  const isPdfLoading = downloadReceiptMutation.isPending;

  const statusInfo = getStatus(order.status, theme);

  return (
    <Box key={`${order.orderNumber}`}>
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.grey[600],
            display: { sm: 'none' },
            fontWeight: 400,
          }}
        >
          {formatDate(order.date, 'dayMonthNameYear')} - {order.products.length}{' '}
          Products
        </Typography>
      </Box>
      <Card
        sx={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Accordion
          label={
            <Box
              sx={{
                py: { xs: 0, sm: 2 },
                width: '100%',
                mr: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                      sx={{
                        color: theme.palette.grey[600],
                        fontWeight: 400,
                      }}
                    >
                      {formatDate(order.date)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.grey[600],
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {!isBetweenMdAndLg ? 'Products: ' : <InventoryTwoTone />}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                        paddingLeft: '4px',
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
                    width: { xs: '120px', lg: '340px' },
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
                  <StyledChip
                    icon={statusInfo.icon}
                    label={statusInfo.label}
                    statusColor={statusInfo.color}
                  />
                </Box>
              </Box>
            </Box>
          }
        >
          <CardContent
            sx={{
              width: '100%',
              padding: 0,
              borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
              '&:last-child': {
                paddingBottom: 0,
              },
            }}
          >
            <StyledInfoGrid>
              <Box
                sx={{
                  flex: { xs: '1 1 0%', lg: '1 1 30%' },
                  minWidth: 0,
                }}
              >
                <StyledLabelWrapper>
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', lg: 'inline' } }}
                  >
                    Delivery:
                  </Box>
                  <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                    <LocalShippingTwoTone />:
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Tooltip
                      title={order.delivery}
                      enterTouchDelay={0}
                      leaveTouchDelay={3000}
                    >
                      <StyledTooltipContent>
                        {order.delivery}
                      </StyledTooltipContent>
                    </Tooltip>
                  </Box>
                </StyledLabelWrapper>
              </Box>
              <Box
                sx={{
                  flex: { xs: '1 1 0%', lg: '1 1 30%' },
                  minWidth: 0,
                }}
              >
                <StyledLabelWrapper>
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', lg: 'inline' } }}
                  >
                    Contacts:
                  </Box>
                  <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                    <PersonSearchTwoTone />:
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Tooltip
                      title={`${order.contactFullName}, ${order.contactPhone}, ${order.contactEmail}`}
                      enterTouchDelay={0}
                      leaveTouchDelay={3000}
                    >
                      <StyledTooltipContent>
                        {order.contactFullName}, {order.contactPhone},{' '}
                        {order.contactEmail}
                      </StyledTooltipContent>
                    </Tooltip>
                  </Box>
                </StyledLabelWrapper>
              </Box>
              <Box
                sx={{
                  flex: { xs: '1 1 0%', lg: '1 1 30%' },
                  minWidth: 0,
                }}
              >
                <StyledLabelWrapper>
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', lg: 'inline' } }}
                  >
                    Payment:
                  </Box>
                  <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                    <PaymentsTwoTone />:
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Tooltip
                      title={order.paymentMethod}
                      enterTouchDelay={0}
                      leaveTouchDelay={3000}
                    >
                      <StyledTooltipContent
                        sx={{
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.paymentMethod}
                      </StyledTooltipContent>
                    </Tooltip>
                  </Box>
                </StyledLabelWrapper>
              </Box>
            </StyledInfoGrid>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
              }}
            >
              <StyledOrderInfo>
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
              </StyledOrderInfo>
              {order.products.map((product) => (
                <StyledProductWrapper key={`${product.id}-${product.size}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
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
                </StyledProductWrapper>
              ))}
            </Box>
            <StyledToolsWrapper>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight:
                    order.discountAmount || order.receipt_url ? '56px' : 0,
                }}
              >
                {order.receipt_url && (
                  <>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload();
                      }}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        textDecoration: 'underline',
                        fontWeight: 500,
                      }}
                      href="#"
                    >
                      <Download sx={{ fontSize: theme.typography.subtitle2 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        PDF {!isBetweenXsAndSm && 'invoice download'}
                      </Typography>
                    </Link>
                    {isPdfLoading && (
                      <LinearProgress sx={{ width: '100%', mt: 0 }} />
                    )}
                  </>
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
                      sx={{ display: 'inline', color: 'green' }}
                    >
                      {order.discountAmount}$
                    </Typography>
                  </Typography>
                )}
              </Box>
            </StyledToolsWrapper>
          </CardContent>
        </Accordion>
      </Card>
    </Box>
  );
};
