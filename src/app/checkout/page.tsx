'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
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
import {
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
  StripeCardElement,
} from '@stripe/stripe-js';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { TAX_PERCENT } from '@/constants/taxPercent';
import { PaymentMethod } from '@/components/CheckoutForm';
import type { PaymentIntent } from '@stripe/stripe-js';

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const {
    items: products,
    discountCode,
    clearCart,
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
      zipCode: '',
      address: '',
      paymentMethod: 'card',
      discountCode: discountCode ?? '',
    },
    shouldFocusError: true,
  });

  const { reset, handleSubmit, watch, getValues, trigger } = methods;

  const paymentMethod = watch('paymentMethod');
  const country = watch('country');

  const { data: shippingTax, isFetching } = useQuery(
    getShippingTaxOptions(country)
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
  const [availablePaymentMethod, setAvailablePaymentMethod] =
    useState<PaymentMethod>('card');

  const productsMetadata = useMemo(() => {
    return splitProducts(products).reduce(
      (acc, chunk, i) => {
        acc[`products${i + 1}`] = chunk;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [products]);

  const finalizeOrder = useCallback(
    (orderNumber: number) => {
      reset();
      clearCart();
      setIsProcessing(false);
      router.push(`/order/?order=${encodeURIComponent(orderNumber)}`);
    },
    [reset, clearCart, router]
  );

  const validateForm = useCallback(async (): Promise<CheckoutSchema | null> => {
    const isValid = await trigger();

    if (!isValid) {
      return null;
    } else {
      return getValues();
    }
  }, [trigger, getValues]);

  const handleOrderComplete = handleSubmit(async (data: CheckoutSchema) => {
    if (!stripe || !elements || cardError !== null) {
      if (cardError === undefined) {
        setCardError('Card number is required');
      }
      return;
    }

    const orderNumber = Date.now();

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

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardEl as StripeCardElement,
            billing_details: {
              name: `${data.name} ${data.surname}`,
              email: data.email,
            },
          },
        }
      );

      if (error) {
        setCardError(error.message ?? 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        elements?.getElement(CardElement)?.clear();
        finalizeOrder(orderNumber);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    if (!stripe) return;

    const initPaymentRequest = async () => {
      const request = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: Math.round(total * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await request.canMakePayment();

      if (result) {
        setPaymentRequest(request);

        if (result.googlePay) {
          setAvailablePaymentMethod('googlePay');
          return;
        }
        if (result.applePay) {
          setAvailablePaymentMethod('applePay');
          return;
        }
        if (result.link) {
          setAvailablePaymentMethod('link');
          return;
        }
      } else {
        setPaymentRequest(null);
        setAvailablePaymentMethod('card');
      }
    };

    initPaymentRequest();
  }, [stripe, total]);

  useEffect(() => {
    if (!stripe || !paymentRequest) return;

    const onPaymentMethod = async (event: PaymentRequestPaymentMethodEvent) => {
      const orderNumber = Date.now();

      try {
        setIsProcessing(true);

        const data = await validateForm();

        if (!data) {
          event.complete('fail');
          setIsProcessing(false);
          return;
        }

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

        const confirmResult = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: event.paymentMethod.id,
          },
          redirect: 'if_required',
        });

        if ('error' in confirmResult && confirmResult.error) {
          event.complete('fail');
          setCardError(confirmResult.error.message ?? 'Payment failed');
          setIsProcessing(false);
          return;
        }

        event.complete('success');

        if (
          'paymentIntent' in confirmResult &&
          confirmResult.paymentIntent &&
          (confirmResult.paymentIntent as PaymentIntent).status === 'succeeded'
        ) {
          finalizeOrder(orderNumber);
        } else {
          setIsProcessing(false);
        }
      } catch (error) {
        console.error(error);
        event.complete('fail');
        setCardError('Payment failed');
        setIsProcessing(false);
      }
    };

    paymentRequest.on('paymentmethod', onPaymentMethod);

    return () => {
      paymentRequest.off('paymentmethod', onPaymentMethod);
    };
  }, [
    stripe,
    paymentRequest,
    createPayment,
    shippingAmount,
    taxPercent,
    total,
    productsMetadata,
    discountAmount,
    availablePaymentMethod,
    validateForm,
    finalizeOrder,
    discountCode,
  ]);
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
              paymentMethod={paymentMethod}
              paymentRequest={paymentRequest}
              availablePaymentMethod={availablePaymentMethod}
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
