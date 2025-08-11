'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import { getSession } from 'next-auth/react';
import StripeProvider from '@/providers/StripeProvider';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OrderHistory } from '@/types/OrderHistory';
import { CartProduct } from '@/types/CartProduct';
import { CartSummary } from '@/components/CartSummary';
import { useCart } from '@/lib/hooks';

export default function Checkout() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [shippingAmount, setShippingAmount] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(17);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string | undefined>(
    undefined
  );
  const { items: products } = useCart();
  const checkoutFormSubmitRef = useRef<() => void>(() => {});

  const onConfirmAndPay = () => {
    checkoutFormSubmitRef.current();
  };

  const handleCartSummaryChange = (
    newTotalAmount: number,
    newDiscountAmount: number,
    newDiscountCode?: string
  ) => {
    setTotalAmount(newTotalAmount);
    setDiscountAmount(newDiscountAmount);
    setDiscountCode(newDiscountCode);
  };

  const handleCountryChange = async (country: string) => {
    if (country) {
      try {
        const res = await fetch(`/api/shipping-and-tax?country=${country}`);
        if (res.ok) {
          const data = await res.json();
          setShippingAmount(data.shippingAmount);
          setTaxPercent(data.taxPercent);
        } else {
          setShippingAmount(20);
          setTaxPercent(17);
        }
      } catch {
        setShippingAmount(20);
        setTaxPercent(17);
      }
    } else {
      setShippingAmount(20);
      setTaxPercent(17);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const session = await getSession();
      if (session) {
        const res = await fetch(`/api/orders?userId=${session.user.id}`, {
          cache: 'no-store',
        });
        const { orders } = await res.json();
        setOrders(orders);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '50px',
        }}
      >
        <StripeProvider>
          <CheckoutForm
            totalAmount={totalAmount}
            products={products}
            shippingAmount={shippingAmount}
            taxPercent={taxPercent}
            onCountryChange={handleCountryChange}
            discountCode={discountCode}
            discountAmount={discountAmount}
            onFormSubmitRef={checkoutFormSubmitRef}
          />
        </StripeProvider>
        <Box sx={{ width: 600 }}>
          <CartSummary
            isCheckout
            taxPercent={taxPercent}
            shippingAmount={shippingAmount}
            onConfirmAndPay={onConfirmAndPay}
            onCartSummaryChange={handleCartSummaryChange}
          />
          <Typography variant="h6" mb={2} mt={5}>
            Your orders
          </Typography>
          {orders.length === 0 ? (
            <Typography>You don&apos;t have orders created yet.</Typography>
          ) : (
            orders.map((order) => (
              <Accordion key={order.orderNumber}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Order #{order.orderNumber} - ${order.summary}
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
        </Box>
      </Box>
    </>
  );
}
