'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CartProduct } from '@/types/CartProduct';
import { useQuery } from '@tanstack/react-query';
import { getOrdersOptions } from '@/api/orders/getOrdersOptions';

export default function Orders() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery(getOrdersOptions());

  return (
    <>
      <Typography variant="h6" mb={2} mt={5}>
        Your orders
      </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : isError ? (
        <Typography variant="body1" color="error">
          Error loading orders.
        </Typography>
      ) : (
        orders.map((order) => (
          <Accordion key={order.orderNumber}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Order #{order.orderNumber} - ${order.summary} - {order.date}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Status:</strong> {order.status}
              </Typography>
              <Typography variant="body2">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </Typography>
              <Typography variant="body2">
                <strong>Contact:</strong> {order.contactFullName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {order.contactEmail}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {order.contactPhone}
              </Typography>
              <Typography variant="body2">
                <strong>Send to:</strong> {order.delivery}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Total:</strong> ${order.summary}
              </Typography>
              {order.discountAmount && (
                <Typography variant="body2">
                  <strong>Discount:</strong> -${order.discountAmount} ({' '}
                  {order.discountCode})
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Shipping:</strong> ${order.shippingAmount}
              </Typography>
              <Typography variant="body2">
                <strong>TAX: </strong> {order.taxPercent}%
              </Typography>
              {order.receipt_url && (
                <Typography variant="body2">
                  <a
                    href={order.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open receipt
                  </a>
                </Typography>
              )}
              <Typography variant="body2" mt={1}>
                <strong>Products:</strong>
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 1,
                }}
              >
                {order.products.map((product: CartProduct, idx: number) => (
                  <Box
                    key={idx}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <img
                      src={product.image ?? '/placeholder.jpg'}
                      alt={product.name}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Box>
                      <Typography variant="body2">
                        <strong>{product.name}</strong> x {product.quantity}
                      </Typography>
                      <Typography variant="body2">
                        ${product.price} - Size {product.size}, Color{' '}
                        {product.color}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </>
  );
}
