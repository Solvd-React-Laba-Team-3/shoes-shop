'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Divider,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/checkout/discount/discountOptions';

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
  const {
    subtotal,
    discountAmount,
    discountCode,
    setDiscount,
    clearDiscount,
    isLoading,
  } = useCart();

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

  const mutation = useApplyDiscount({
    onSuccess: (result, variables) => {
      if (result.valid) {
        let newDiscountAmount = 0;
        if (result.type === 'amount' && result.amountOff) {
          newDiscountAmount = result.amountOff;
        } else if (result.type === 'percent' && result.percentOff) {
          newDiscountAmount = (subtotal * result.percentOff) / 100;
        }

        setDiscount(result.code ?? variables.code, newDiscountAmount);
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
        clearDiscount();

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
      clearDiscount();

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

  const subtotalWithDiscount = useMemo(() => {
    if (isLoading) return 0;
    return subtotal - discountAmount;
  }, [subtotal, discountAmount, isLoading]);

  const taxAmount = useMemo(() => {
    if (isLoading) return 0;
    return (subtotalWithDiscount * taxPercent) / 100;
  }, [subtotalWithDiscount, taxPercent, isLoading]);

  const finalTotal = useMemo(() => {
    if (isLoading) return 0;
    return subtotalWithDiscount + taxAmount + shippingAmount;
  }, [subtotalWithDiscount, taxAmount, shippingAmount, isLoading]);

  useEffect(() => {
    if (onCartSummaryChange) {
      onCartSummaryChange(finalTotal, discountAmount, discountCode);
    }
  }, [finalTotal, discountAmount, discountCode, onCartSummaryChange]);

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
          {mutation.isPending && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress />
            </Box>
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
          {'Subtotal'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      {!isLoading &&
        typeof discountAmount === 'number' &&
        discountAmount > 0 && (
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

      {isLoading && (
        <Box>
          <LinearProgress />
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
