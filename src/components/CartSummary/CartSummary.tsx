'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';
import { useMutation } from '@tanstack/react-query';
import { DiscountResponse } from '@/types/api/DiscountResponse';
import { DiscountBody } from '@/types/api/DiscountBody';
import { applyDiscountFn } from '@/api/discount/discountOptions';

interface CartSummaryProps {
  isCheckout?: boolean;
  onConfirmAndPay?: () => void;
  taxPercent?: number;
  shippingAmount?: number;
  onCartSummaryChange?: (
    total: number,
    discountAmount: number,
    discountCode?: string
  ) => void;
}

export const CartSummary = ({
  isCheckout = false,
  onConfirmAndPay,
  taxPercent = 17,
  shippingAmount = 20,
  onCartSummaryChange,
}: CartSummaryProps) => {
  const router = useRouter();
  const { subtotal } = useCart();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<
    string | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CartSchema>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      promoCode: '',
    },
    shouldFocusError: true,
  });

  const mutation = useMutation<DiscountResponse, Error, DiscountBody>({
    mutationFn: applyDiscountFn,
    onSuccess: (result, variables) => {
      if (result.valid) {
        let newDiscountAmount = 0;
        if (result.type === 'amount' && result.amountOff) {
          newDiscountAmount = result.amountOff;
        } else if (result.type === 'percent' && result.percentOff) {
          newDiscountAmount = (subtotal * result.percentOff) / 100;
        }

        setDiscountAmount(newDiscountAmount);
        setAppliedDiscountCode(result.code ?? variables.code);
        clearErrors('promoCode');

        const subtotalWithNewDiscount = subtotal - newDiscountAmount;
        const taxWithNewDiscount = (subtotalWithNewDiscount * taxPercent) / 100;
        const finalTotalWithNewDiscount =
          subtotalWithNewDiscount + taxWithNewDiscount + shippingAmount;

        if (onCartSummaryChange) {
          onCartSummaryChange(
            finalTotalWithNewDiscount,
            newDiscountAmount,
            result.code ?? variables.code
          );
        }
      } else {
        setError('promoCode', {
          type: 'manual',
          message: 'Invalid promo code',
        });
        setDiscountAmount(0);

        if (onCartSummaryChange) {
          const totalWithoutDiscount =
            subtotal + (subtotal * taxPercent) / 100 + shippingAmount;
          onCartSummaryChange(totalWithoutDiscount, 0, undefined);
        }
      }
    },
    onError: () => {
      setError('promoCode', {
        type: 'manual',
        message: 'Error. Try again.',
      });
      setDiscountAmount(0);

      if (onCartSummaryChange) {
        const totalWithoutDiscount =
          subtotal + (subtotal * taxPercent) / 100 + shippingAmount;
        onCartSummaryChange(totalWithoutDiscount, 0, undefined);
      }
    },
  });

  const onApplyPromo = (data: CartSchema) => {
    const promoCode = data.promoCode.trim();
    mutation.mutate({ code: promoCode, total: subtotal });
  };

  const handleCheckout = () => {
    if (isCheckout && onConfirmAndPay) {
      onConfirmAndPay();
    } else {
      router.push('/checkout');
    }
  };

  const subtotalWithDiscount = useMemo(
    () => subtotal - discountAmount,
    [subtotal, discountAmount]
  );

  const taxAmount = useMemo(
    () => (subtotalWithDiscount * taxPercent) / 100,
    [subtotalWithDiscount, taxPercent]
  );

  const finalTotal = useMemo(
    () => subtotalWithDiscount + taxAmount + shippingAmount,
    [subtotalWithDiscount, taxAmount, shippingAmount]
  );

  useEffect(() => {
    if (onCartSummaryChange) {
      onCartSummaryChange(finalTotal, discountAmount, appliedDiscountCode);
    }
  }, [finalTotal, discountAmount, appliedDiscountCode, onCartSummaryChange]);

  return (
    <Box>
      <Accordion
        label={
          <Typography sx={{ fontSize: '20px' }}>
            Do you have a promocode?
          </Typography>
        }
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onApplyPromo)}
          noValidate
          autoComplete="off"
        >
          <TextField
            size="small"
            color="secondary"
            placeholder="Enter promo code"
            sx={{
              width: '50%',
              height: '40px',
              marginRight: '10px',
              '& .MuiInputBase-root': {
                fontSize: '16px',
              },
            }}
            {...register('promoCode', {
              onChange: (e) => {
                const upperValue = e.target.value.toUpperCase();
                e.target.value = upperValue;
              },
            })}
            error={!!errors.promoCode}
            helperText={errors.promoCode?.message}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
          >
            Apply
          </Button>
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
          {'Subtotal'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      {discountAmount > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px 0',
            color: discountAmount > 0 ? 'green' : 'inherit',
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

      {isCheckout && (
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
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                maxWidth: '10%',
              }}
            >
              Total
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              ${finalTotal.toFixed(2)}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ marginBottom: '113px' }} />
      <Button onClick={handleCheckout} sx={{ width: '100%' }}>
        {isCheckout ? 'Confirm & Pay' : 'Checkout'}
      </Button>
    </Box>
  );
};
