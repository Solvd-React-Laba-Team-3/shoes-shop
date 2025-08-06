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
  TextField,
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
    price: 200,
    quantity: 1,
    image: 'https://example.com/images/zapatilla-flex.jpg',
    color: 'Negro',
  },
  {
    id: 102,
    name: 'Campera Impermeable Pro',
    size: 38,
    gender: 'female',
    price: 300,
    quantity: 1,
    image: 'https://example.com/images/campera-pro.jpg',
    color: 'Azul',
  },
  {
    id: 103,
    name: 'Remera DryFit Training',
    size: 44,
    gender: 'unisex',
    price: 500,
    quantity: 2,
    image: 'https://example.com/images/remera-training.jpg',
    color: 'Rojo',
  },
  {
    id: 104,
    name: 'Short Deportivo Runner',
    size: 40,
    gender: 'male',
    price: 800,
    quantity: 1,
    image: 'https://example.com/images/short-runner.jpg',
    color: 'Gris',
  },
  {
    id: 105,
    name: 'Calza Compresión Alta',
    size: 36,
    gender: 'female',
    price: 1200,
    quantity: 1,
    image: 'https://example.com/images/calza-compresion.jpg',
    color: 'Negro',
  },
];

const calculateTotal = (items: StripeProduct[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default function Checkout() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [shippingAmount, setShippingAmount] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(17);

  const baseAmount = calculateTotal(products);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [taxAmount, setTaxAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(baseAmount);

  const [codeFeedback, setCodeFeedback] = useState<string | null>(null);

  useEffect(() => {
    const subtotalAfterDiscount = baseAmount - discountAmount;
    const calculatedTax = (subtotalAfterDiscount * taxPercent) / 100;
    const newFinalAmount =
      subtotalAfterDiscount + calculatedTax + shippingAmount;

    setTaxAmount(calculatedTax);
    setFinalAmount(newFinalAmount);
  }, [baseAmount, discountAmount, shippingAmount, taxPercent]);

  const handleDiscountSubmit = async () => {
    if (!discountCode.trim()) return;

    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          total: baseAmount,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        setDiscountAmount(data.discountAmount);
        setCodeFeedback(`Applied code: ${data.code}`);
      } else {
        setDiscountAmount(0);
        setCodeFeedback('Invalid code');
      }
    } catch {
      setCodeFeedback('Server error');
    }
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/orders?userId=${session.user.id}`,
          { cache: 'no-store' }
        );
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
            totalAmount={finalAmount}
            products={products}
            shippingAmount={shippingAmount}
            taxPercent={taxPercent}
            onCountryChange={handleCountryChange}
            discountAmount={discountAmount}
            discountCode={discountCode}
          />
        </StripeProvider>
        <Box sx={{ width: 600 }}>
          <Box
            sx={{
              mb: 4,
              p: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              maxWidth: 400,
            }}
          >
            <Typography variant="h6">Total simulator</Typography>

            <Box sx={{ mt: 2 }}>
              <Typography>Base amount: ${baseAmount.toFixed(2)}</Typography>
              <Typography>
                Discount applied: -${discountAmount.toFixed(2)}
              </Typography>
              <Typography>Shipping: ${shippingAmount.toFixed(2)}</Typography>
              <Typography>
                Tax ({taxPercent}%): ${taxAmount.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Final amount: <strong>${finalAmount.toFixed(2)}</strong>
              </Typography>
            </Box>

            <TextField
              label="Discount code"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2 }}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDiscountSubmit();
                }
              }}
            />

            {codeFeedback && (
              <Typography
                variant="body2"
                color={codeFeedback.includes('invalid') ? 'error' : 'success'}
                sx={{ mt: 1 }}
              >
                {codeFeedback}
              </Typography>
            )}
          </Box>

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
