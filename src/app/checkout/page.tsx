'use client';

import { useRef, useState } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import StripeProvider from '@/providers/StripeProvider';
import { Box, LinearProgress } from '@mui/material';
import { CartSummary } from '@/components/CartSummary';
import { useCart } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { getShippingTaxOptions } from '@/api/shippingAndTax/getShippingTaxOptions';

export default function Checkout() {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string | undefined>(
    undefined
  );
  const { items: products } = useCart();

  const [country, setCountry] = useState<string>('');
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
  };
  const { data: shippingTax } = useQuery(getShippingTaxOptions(country));
  const shippingAmount = shippingTax?.shippingAmount ?? 20;
  const taxPercent = shippingTax?.taxPercent ?? 17;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const handlePaymentComplete = () => {
    setIsProcessingPayment(false);
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

  const checkoutFormSubmitRef = useRef<() => void>(() => {});
  const onConfirmAndPay = () => {
    setIsProcessingPayment(true);
    checkoutFormSubmitRef.current();
  };

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
            onPaymentComplete={handlePaymentComplete}
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
          {isProcessingPayment && <LinearProgress sx={{ marginTop: 2 }} />}
        </Box>
      </Box>
    </>
  );
}
