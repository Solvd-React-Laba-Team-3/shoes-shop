'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, FormErrorMessage, LabeledTextfield } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart, useLocalStorage } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { FC, FormEvent, useState } from 'react';
import { TAX_PERCENT } from '@/constants/taxPercent';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../CheckoutForm';
import { PaymentRequest } from '@stripe/stripe-js';

interface CartSummaryProps {
  checkout?: boolean;
  taxPercent?: number;
  shippingAmount?: number;
  onOrderComplete?: () => void;
  paymentRequest?: PaymentRequest | null;
  paymentMethod?: PaymentMethod;
  availablePaymentMethod?: PaymentMethod;
}

export const CartSummary: FC<CartSummaryProps> = ({
  checkout = false,
  taxPercent = TAX_PERCENT,
  shippingAmount = SHIPPING_AMOUNT,
  onOrderComplete,
  paymentRequest,
  paymentMethod,
  availablePaymentMethod,
}) => {
  const router = useRouter();
  const { value: promoOpen, setValue: setPromoOpen } = useLocalStorage<boolean>(
    'promoOpen',
    false
  );

  const { subtotal, discountAmount, discountCode, isLoading, getTotal } =
    useCart();

  const [isEditing, setIsEditing] = useState(false);

  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalWithDiscount * taxPercent) / 100;
  const total = getTotal(shippingAmount, taxPercent);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CartSchema>({
    resolver: zodResolver(cartSchema),
    defaultValues: { promoCode: discountCode ?? '' },
    shouldFocusError: true,
  });

  const { mutate: applyDiscount, isPending } = useApplyDiscount({
    subtotal,
    setError,
    clearErrors,
  });

  const onApplyPromo = (data: CartSchema) => {
    const promoCode = data.promoCode.trim();
    applyDiscount({ code: promoCode, total: subtotal });
    setIsEditing(false);
  };

  const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/checkout');
  };

  const renderPaymentButton = () => {
    if (!checkout) {
      return (
        <Button
          disabled={isLoading || isPending || subtotal === 0}
          type="submit"
          sx={{ width: '100%' }}
        >
          Checkout
        </Button>
      );
    }

    switch (paymentMethod) {
      case 'card':
        return (
          <Button
            type="submit"
            sx={{ width: '100%' }}
            disabled={isLoading || isPending}
          >
            Confirm & Pay
          </Button>
        );

      case 'googlePay':
        if (!isLoading && !isPending) {
          return availablePaymentMethod === 'googlePay' && paymentRequest ? (
            <PaymentRequestButtonElement
              options={{
                paymentRequest: paymentRequest!,
                style: {
                  paymentRequestButton: {
                    type: 'check-out',
                  },
                },
              }}
            />
          ) : (
            <FormErrorMessage message="Google Pay is not supported" />
          );
        }
      case 'applePay':
        if (!isLoading && !isPending) {
          return availablePaymentMethod === 'applePay' && paymentRequest ? (
            <PaymentRequestButtonElement
              options={{
                paymentRequest: paymentRequest!,
                style: {
                  paymentRequestButton: {
                    type: 'check-out',
                  },
                },
              }}
            />
          ) : (
            <FormErrorMessage message="Apple Pay is not supported" />
          );
        }
      case 'link':
        if (!isLoading && !isPending) {
          return availablePaymentMethod === 'link' && paymentRequest ? (
            <PaymentRequestButtonElement
              options={{
                paymentRequest: paymentRequest!,
                style: {
                  paymentRequestButton: {
                    type: 'check-out',
                  },
                },
              }}
            />
          ) : (
            <FormErrorMessage message="Link is not supported" />
          );
        }
      default:
        return null;
    }
  };

  return (
    <Box>
      <Accordion
        expanded={promoOpen}
        onChange={(_, isExpanded) => setPromoOpen(isExpanded)}
        label={
          <Typography sx={{ fontSize: '20px' }}>
            Do you have a promo code?
          </Typography>
        }
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onApplyPromo)}
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', gap: '10px' }}
        >
          <LabeledTextfield
            size="small"
            color="secondary"
            placeholder="Enter promo code"
            {...register('promoCode', {
              onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
            })}
            error={!!errors.promoCode}
            errorMessage={errors.promoCode?.message}
            disabled={isPending || (discountAmount > 0 && !isEditing)}
          />
          {discountAmount > 0 && !isEditing ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              type="button"
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              loading={isPending}
              disabled={subtotal === 0 || !watch('promoCode').trim()}
            >
              Apply
            </Button>
          )}
        </Box>
      </Accordion>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '38px 0 20px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          Subtotal
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      {!isLoading && discountAmount > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px 0',
            color: 'green',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            Discount
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            -${discountAmount.toFixed(2)}
          </Typography>
        </Box>
      )}

      {checkout && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px 0',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              Shipping
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              ${shippingAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px 0',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              Tax ({taxPercent}%)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 400 }}>
              ${taxAmount.toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ marginTop: '56px' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px 0',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Total
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              ${total}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ marginBottom: '43px' }} />

      <Box
        component="form"
        onSubmit={checkout ? onOrderComplete : handleCheckout}
      >
        {renderPaymentButton()}
      </Box>
    </Box>
  );
};
