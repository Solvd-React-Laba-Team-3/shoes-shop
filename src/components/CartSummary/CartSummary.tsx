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
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart, useLocalStorage } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { useEffect } from 'react';

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
  onCartSummaryChange,
  taxPercent = 17,
  shippingAmount = 20,
}: CartSummaryProps) => {
  const router = useRouter();
  const { value: promoOpen, setValue: setPromoOpen } = useLocalStorage<boolean>(
    'promoOpen',
    false
  );

  const {
    subtotal,
    discountAmount,
    discountCode,
    setDiscount,
    clearDiscount,
    isLoading,
  } = useCart();

  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalWithDiscount * taxPercent) / 100;
  const finalTotal = subtotalWithDiscount + shippingAmount + taxAmount;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CartSchema>({
    resolver: zodResolver(cartSchema),
    defaultValues: { promoCode: '' },
    shouldFocusError: true,
  });

  const mutation = useApplyDiscount({
    subtotal,
    taxPercent: (taxAmount / subtotalWithDiscount) * 100,
    shippingAmount,
    setDiscount,
    clearDiscount,
    setError,
    clearErrors,
    onCartSummaryChange,
  });

  const onApplyPromo = (data: CartSchema) => {
    const promoCode = data.promoCode.trim();
    mutation.mutate({ code: promoCode, total: subtotal });
  };

  const handleCheckout = () => {
    if (isCheckout && onConfirmAndPay) onConfirmAndPay();
    else router.push('/checkout');
  };

  useEffect(() => {
    if (!isLoading) {
      onCartSummaryChange?.(finalTotal, discountAmount, discountCode);
    }
  }, [
    finalTotal,
    discountAmount,
    discountCode,
    isLoading,
    onCartSummaryChange,
  ]);

  return (
    <Box>
      <Accordion
        expanded={promoOpen}
        onChange={(_, isExpanded) => setPromoOpen(isExpanded)}
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
            placeholder={discountCode || 'Enter promo code'}
            sx={{
              width: '50%',
              height: '40px',
              marginRight: '10px',
              '& .MuiInputBase-root': { fontSize: '16px' },
            }}
            {...register('promoCode', {
              onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
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
            {discountCode ? 'Change' : 'Apply'}
          </Button>
          {mutation.isPending && <LinearProgress sx={{ mt: 1 }} />}
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
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
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
