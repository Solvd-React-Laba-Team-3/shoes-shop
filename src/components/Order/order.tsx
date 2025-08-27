'use client';

import { Box, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  Download,
  LocalShippingTwoTone,
  PaymentsTwoTone,
  PersonSearchTwoTone,
} from '@mui/icons-material';
import {
  StyledToolsWrapper,
  StyledInfoGrid,
  StyledDownloadButton,
} from './order.styles';
import { Order as OrderType } from '@/types/Order';
import { useDownloadReceipt } from '@/api/receipts/useDownloadReceipt';
import { formatDate } from '@/lib/utils/';
import { FC } from 'react';
import { Tooltip, Accordion } from '../ui';
import { ItemLabel } from '../ItemLabel';
import { OrderProducts } from '../OrderProducts';
import { OrderPreview } from '../OrderPreview';

interface OrderProps {
  order: OrderType;
}

export const Order: FC<OrderProps> = ({ order }) => {
  const theme = useTheme();
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const { mutate: downloadReceipt, isPending: isDownloading } =
    useDownloadReceipt();

  const handleDownloadReceipt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!order.latest_charge) return;

    downloadReceipt({
      chargeId: order.latest_charge,
      orderNumber: String(order.orderNumber),
    });
  };

  return (
    <Box key={`${order.orderNumber}`}>
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          component={'p'}
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
      <Accordion
        sx={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[100],
        }}
        label={<OrderPreview order={order} />}
      >
        <Box
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
            <Tooltip title={order.delivery}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingTwoTone
                  sx={{ display: { xs: 'flex', lg: 'none' } }}
                />
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ display: { xs: 'none', lg: 'inline' } }}
                >
                  Delivery:
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ fontWeight: { xs: 400, lg: 500 } }}
                >
                  {order.delivery}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip
              title={`${order.contactFullName}, ${order.contactPhone}, ${order.contactEmail}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonSearchTwoTone
                  sx={{ display: { xs: 'flex', lg: 'none' } }}
                />
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ display: { xs: 'none', lg: 'inline' } }}
                >
                  Contacts:
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ fontWeight: { xs: 400, lg: 500 } }}
                >
                  {order.contactEmail}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title={order.paymentMethod}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentsTwoTone sx={{ display: { xs: 'flex', lg: 'none' } }} />
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ display: { xs: 'none', lg: 'inline' } }}
                >
                  Payment:
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    fontWeight: { xs: 400, lg: 500 },
                    textTransform: 'capitalize',
                  }}
                >
                  {order.paymentMethod}
                </Typography>
              </Box>
            </Tooltip>
          </StyledInfoGrid>
          <OrderProducts products={order.products} />
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
                <Box sx={{ position: 'relative' }}>
                  <StyledDownloadButton
                    variant="text"
                    size="small"
                    startIcon={
                      <Download sx={{ fontSize: theme.typography.subtitle2 }} />
                    }
                    onClick={handleDownloadReceipt}
                    isDownloading={isDownloading}
                  >
                    <Typography
                      variant="subtitle2"
                      component={'p'}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {isDownloading
                        ? 'Generating...'
                        : `PDF ${!isBetweenXsAndSm ? 'invoice download' : ''}`}
                    </Typography>
                  </StyledDownloadButton>
                  {isDownloading && (
                    <LinearProgress
                      sx={{ width: '100%', mt: 0, position: 'absolute' }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ textAlign: 'left', mr: 2 }}>
              {order.discountAmount && (
                <ItemLabel
                  label="Discount: "
                  title={`${order.discountAmount}$`}
                  labelColor={theme.palette.grey[600]}
                  valueColor="green"
                />
              )}
            </Box>
          </StyledToolsWrapper>
        </Box>
      </Accordion>
    </Box>
  );
};
