'use client';

import { useEffect, useState } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/common/Header';
import { Box, LinearProgress } from '@mui/material';
import { CartSummary } from '@/components/CartSummary';
import { useCart } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { getShippingTaxOptions } from '@/api/shippingAndTax/getShippingTaxOptions';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutSchema } from './checkout.schema';
import { splitProducts } from '@/lib/utils';
import { useCreatePayment } from '@/api/payment/useCreatePayment';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { PaymentRequest, StripeCardElement } from '@stripe/stripe-js';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { TAX_PERCENT } from '@/constants/taxPercent';

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const {
    items: products,
    discountCode,
    clearCart,
    clearDiscount,
    getTotal,
    discountAmount,
  } = useCart();

  const methods = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      state: '',
      zipCode: '',
      address: '',
      paymentMethod: 'card',
      discountCode: discountCode ?? '',
    },
    shouldFocusError: true,
  });

  const { reset, handleSubmit, watch } = methods;

  const { data: shippingTax, isFetching } = useQuery(
    getShippingTaxOptions(watch('country'))
  );
  const { mutateAsync: createPayment, isError } = useCreatePayment();

  const shippingAmount = shippingTax?.shippingAmount ?? SHIPPING_AMOUNT;
  const taxPercent = shippingTax?.taxPercent ?? TAX_PERCENT;
  const total = getTotal(shippingAmount, taxPercent);

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null | undefined>(
    undefined
  );
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  const handleOrderComplete = handleSubmit(async (data: CheckoutSchema) => {
    if (!stripe || !elements || cardError !== null) {
      if (cardError === undefined) {
        setCardError('Card number is required');
      }
      return;
    }

    const orderNumber = Date.now();

    const productsMetadata = splitProducts(products).reduce(
      (acc, chunk, i) => {
        acc[`products${i + 1}`] = chunk;
        return acc;
      },
      {} as Record<string, string>
    );

    const finalizeOrder = () => {
      reset();
      clearCart();
      clearDiscount();
      setIsProcessing(false);
      router.push(`/order/?order=${encodeURIComponent(orderNumber)}`);
    };

    try {
      setIsProcessing(true);

      const paymentData = {
        ...data,
        amount: total,
        discountAmount,
        discountCode,
        shippingAmount,
        taxPercent,
        orderNumber,
        productsMetadata,
      };

      const { clientSecret } = await createPayment(paymentData);

      const cardEl = elements.getElement(CardElement);

      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl as StripeCardElement,
          billing_details: {
            name: `${data.name} ${data.surname}`,
            email: data.email,
          },
        },
      });

      if (paymentIntent?.status === 'succeeded') {
        elements?.getElement(CardElement)?.clear();
      }
    } catch (error) {
      console.error(error);
    } finally {
      finalizeOrder();
    }
  });

  // For Google Pay and Apple Pay payments
  useEffect(() => {
    if (!stripe) return;

    const initPaymentRequest = async () => {
      const request = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: Math.round(total),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await request.canMakePayment();

      if (result) {
        setPaymentRequest(request);
      }
    };

    initPaymentRequest();
  }, [stripe, total]);

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
        <FormProvider {...methods}>
          <CheckoutForm
            paymentRequest={paymentRequest}
            error={isError}
            cardError={cardError}
            setCardError={setCardError}
          />
          <Box sx={{ width: 600 }}>
            <CartSummary
              checkout
              taxPercent={taxPercent}
              shippingAmount={shippingAmount}
              onOrderComplete={handleOrderComplete}
            />
            {(isProcessing || isFetching) && (
              <LinearProgress sx={{ marginTop: 2 }} />
            )}
          </Box>
        </FormProvider>
      </Box>
    </>
  );
}
