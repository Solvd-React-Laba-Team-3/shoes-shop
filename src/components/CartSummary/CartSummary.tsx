'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Divider,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';

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

  const isSmall = useMediaQuery('(max-width:400px)');
  const isMedium = useMediaQuery('(min-width:400px) and (max-width:1280px)');

  const onApplyPromo = async (data: CartSchema) => {
    const promoCode = data.promoCode.trim();

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promoCode, total: subtotal }),
      });
      const result = await response.json();

      if (response.ok && result.valid) {
        const newDiscountAmount = result.discountAmount;
        setDiscountAmount(newDiscountAmount);
        setAppliedDiscountCode(promoCode);
        clearErrors('promoCode');

        const subtotalWithNewDiscount = subtotal - newDiscountAmount;
        const taxWithNewDiscount = (subtotalWithNewDiscount * taxPercent) / 100;
        const finalTotalWithNewDiscount =
          subtotalWithNewDiscount + taxWithNewDiscount + shippingAmount;

        if (onCartSummaryChange) {
          onCartSummaryChange(
            finalTotalWithNewDiscount,
            newDiscountAmount,
            promoCode
          );
        }
      } else {
        setError('promoCode', {
          type: 'manual',
          message: result.error || 'Invalid promo code',
        });
        setDiscountAmount(0);

        if (onCartSummaryChange) {
          const totalWithoutDiscount =
            subtotal + (subtotal * taxPercent) / 100 + shippingAmount;
          onCartSummaryChange(totalWithoutDiscount, 0, undefined);
        }
      }
    } catch {
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
    }
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
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: '10px' },
          }}
        >
          <TextField
            size="small"
            color="secondary"
            placeholder="Enter promo code"
            sx={{
              width: { xs: '100%', sm: '50%' },
              height: '40px',
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
          flexWrap: 'wrap',
          margin: '38px 0 20px',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 400,
          }}
        >
          {'Subtotal'}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 400,
          }}
        >
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          margin: '38px 0 20px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          Shipping
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {isCheckout ? `$${shippingAmount.toFixed(2)}` : '-'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          margin: '38px 0 20px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          Tax
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {isCheckout ? `$${taxAmount.toFixed(2)}` : '-'}
        </Typography>
      </Box>

      <Divider />

      <Typography variant="caption">
        Shipping and tax will be calculated at checkout.
      </Typography>

      {discountAmount > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
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

      {/* {isCheckout && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            margin: '20px 0',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, maxWidth: '10%' }}>
            Total
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            ${finalTotal.toFixed(2)}
          </Typography>
        </Box>
      )} */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          margin: '20px 0',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600, maxWidth: '10%' }}>
          Total
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {isCheckout
            ? `$${finalTotal.toFixed(2)}`
            : discountAmount > 0
              ? `$${(subtotal - discountAmount).toFixed(2)}`
              : `$${subtotal.toFixed(2)}`}
        </Typography>
      </Box>

      <Divider sx={{ mb: { xs: 4, md: '22px' } }} />
      <Button
        onClick={handleCheckout}
        size={isSmall ? 'small' : isMedium ? 'medium' : 'large'}
        sx={{ width: '100%' }}
      >
        {isCheckout ? 'Confirm & Pay' : 'Checkout'}
      </Button>
    </Box>
  );
};
