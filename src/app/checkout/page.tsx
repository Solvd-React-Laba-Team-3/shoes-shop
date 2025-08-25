'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
import { StripeCardElement } from '@stripe/stripe-js';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { TAX_PERCENT } from '@/constants/taxPercent';

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/sign-in?next=checkout');
    }
  }, [session, status, router]);

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
      name: session?.user?.firstName ?? '',
      surname: session?.user?.lastName ?? '',
      email: session?.user?.email ?? '',
      phone: session?.user?.phoneNumber ?? '',
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null | undefined>(
    undefined
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
        amount: getTotal(shippingAmount, taxPercent),
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
