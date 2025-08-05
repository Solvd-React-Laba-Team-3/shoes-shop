'use client';

import { useEffect, useState } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import { getSession } from 'next-auth/react';
import StripeProvider from '@/providers/StripeProvider';
import { StripeProduct } from '@/types/StripeProduct';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OrderHistory } from '@/types/OrderHistory';

const products: StripeProduct[] = [
  {
    id: 101,
    name: 'Zapatilla Urbana Flex',
    size: 42,
    gender: 'male',
    price: 17999,
    quantity: 1,
    image: 'https://example.com/images/zapatilla-flex.jpg',
    color: 'Negro',
  },
  {
    id: 102,
    name: 'Campera Impermeable Pro',
    size: 38,
    gender: 'female',
    price: 32999,
    quantity: 1,
    image: 'https://example.com/images/campera-pro.jpg',
    color: 'Azul',
  },
  {
    id: 103,
    name: 'Remera DryFit Training',
    size: 44,
    gender: 'unisex',
    price: 9999,
    quantity: 2,
    image: 'https://example.com/images/remera-training.jpg',
    color: 'Rojo',
  },
  {
    id: 104,
    name: 'Short Deportivo Runner',
    size: 40,
    gender: 'male',
    price: 8499,
    quantity: 1,
    image: 'https://example.com/images/short-runner.jpg',
    color: 'Gris',
  },
  {
    id: 105,
    name: 'Calza Compresión Alta',
    size: 36,
    gender: 'female',
    price: 12999,
    quantity: 1,
    image: 'https://example.com/images/calza-compresion.jpg',
    color: 'Negro',
  },
];

export default function Checkout() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [shippingAmount, setShippingAmount] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(17);

  const handleCountryChange = async (country: string) => {
    if (country) {
      try {
        const res = await fetch(`/api/shipping-and-tax?country=${country}`);
        if (res.ok) {
          const data = await res.json();
          console.log('Data received from API:', data);
          setShippingAmount(data.shippingAmount);
          setTaxPercent(data.taxPercent);
        } else {
          console.error('Failed to fetch shipping and tax rates');
          setShippingAmount(20);
          setTaxPercent(17);
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/orders?userId=${session.user.id}`,
          { cache: 'no-store' }
        );
        const { orders } = await res.json();
        setOrders(orders);
        console.log('ORDERS FROM STRIPE:', orders);
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
            totalAmount={500}
            products={products}
            shippingAmount={shippingAmount}
            taxPercent={taxPercent}
            onCountryChange={handleCountryChange}
          />
        </StripeProvider>
        <Box sx={{ width: 600 }}>
          <Typography variant="h6" mb={2}>
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
                      <strong>Discount:</strong> -${order.discountAmount} (
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
                    {order.products.map(
                      (product: StripeProduct, idx: number) => (
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
                              <strong>{product.name}</strong> x
                              {product.quantity}
                            </Typography>
                            <Typography variant="body2">
                              ${product.price} - Talle {product.size}, Color{' '}
                              {product.color}
                            </Typography>
                          </Box>
                        </Box>
                      )
                    )}
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
