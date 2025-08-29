'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, LabeledTextfield } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { useLocalStorage } from '@/lib/hooks';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import type { PaymentMethod } from '@/types/PaymentMethod';
import { PaymentRequest } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { ConfirmActionModal } from '../common/ConfirmActionModal';

interface CartSummaryProps {
  checkout?: boolean;
  taxPercent?: number;
  shippingAmount?: number;
  onOrderComplete?: () => void;
  paymentRequest?: PaymentRequest | null;
  paymentMethod?: PaymentMethod;
  isFetching?: boolean;
  isProcessing?: boolean;
}

export const CartSummary: FC<CartSummaryProps> = ({
  checkout = false,
  taxPercent = 0,
  shippingAmount = 0,
  onOrderComplete,
  paymentRequest,
  paymentMethod,
  isFetching = false,
  isProcessing = false,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { value: promoOpen, setValue: setPromoOpen } = useLocalStorage<boolean>(
    'promoOpen',
    false
  );

  const { subtotal, discountAmount, discountCode, isLoading, getTotal } =
    useCart();

  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
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

    if (!session) {
      setShowLoginConfirm(true);
      return;
    }

    router.push('/checkout');
  };

  const renderPaymentButton = () => {
    const disabled: boolean =
      isLoading || isPending || isProcessing || isFetching;

    if (!checkout) {
      return (
        <Button
          disabled={disabled || subtotal === 0}
          type="submit"
          size="large"
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
            size="large"
            disabled={disabled}
          >
            Confirm & Pay
          </Button>
        );

      case 'googlePay':
      case 'applePay':
      case 'link':
        if (!disabled) {
          return (
            paymentRequest && (
              <PaymentRequestButtonElement
                options={{
                  paymentRequest,
                  style: {
                    paymentRequestButton: {
                      type: 'check-out',
                    },
                  },
                }}
              />
            )
          );
        }
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        Summary
      </Typography>
      <Accordion
        expanded={promoOpen}
        onChange={(_, isExpanded) => setPromoOpen(isExpanded)}
        label={
          <Typography sx={{ fontSize: '20px', fontWeight: 400 }}>
            Do you have a promo code?
          </Typography>
        }
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onApplyPromo)}
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <LabeledTextfield
            size="small"
            color="secondary"
            placeholder="Enter promo code"
            sx={{
              height: '40px',
              '& .MuiInputBase-root': {
                margin: { sm: '0' },
              },
            }}
            {...register('promoCode', {
              onChange: (e) => {
                const upperValue = e.target.value.toUpperCase();
                e.target.value = upperValue;
              },
            })}
            error={!!errors.promoCode}
            errorMessage={errors.promoCode?.message}
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
          margin: '18px 0 20px',
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
            flexWrap: 'wrap',
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
          {checkout ? `$${shippingAmount.toFixed(2)}` : '-'}
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
          {checkout ? `$${taxAmount.toFixed(2)}` : '-'}
        </Typography>
      </Box>
      {!checkout ? (
        <>
          <Divider sx={{ marginTop: '32px' }} />
          <Typography variant="caption">
            Shipping and tax will be calculated at checkout.
          </Typography>
        </>
      ) : (
        <Divider sx={{ marginTop: '56px' }} />
      )}
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

      <Divider sx={{ marginBottom: '113px' }} />
      <Box
        component="form"
        onSubmit={checkout ? onOrderComplete : handleCheckout}
      >
        {renderPaymentButton()}
      </Box>

      <ConfirmActionModal
        open={showLoginConfirm}
        title="Login required"
        description="You need to sign in to complete your purchase. Do you want to go to the login page now?"
        onClose={() => setShowLoginConfirm(false)}
        onConfirm={() => router.push('/auth/sign-in?next=checkout')}
        cancelText="Stay here"
        confirmText="Go to login"
      />
    </Box>
  );
};
