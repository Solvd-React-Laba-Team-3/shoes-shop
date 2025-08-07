'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';

const MOCK_PROMO_CODE = {
  value: 'SAVE10',
  discount: 10,
};

export const CartSummary = () => {
  const router = useRouter();

  const { subtotal } = useCart();

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

  const [discount, setDiscount] = useState(0);

  const onApplyPromo = (data: CartSchema) => {
    const promoCode = data.promoCode.trim();

    // TODO: replace with Stripe API call
    if (promoCode === MOCK_PROMO_CODE.value) {
      setDiscount(MOCK_PROMO_CODE.discount);
      clearErrors('promoCode');
    } else {
      setError('promoCode', {
        type: 'manual',
        message: 'Invalid promo code',
      });
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const discountSum = useMemo(
    () => (subtotal * discount) / 100,
    [subtotal, discount]
  );
  const finalTotal = useMemo(
    () => subtotal - discountSum,
    [subtotal, discountSum]
  );

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

      {discount > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px 0',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            Discount
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            -${discountSum.toFixed(2)}
          </Typography>
        </Box>
      )}

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
            color: discount > 0 ? 'green' : 'inherit',
          }}
        >
          Total
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          ${finalTotal.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ marginBottom: '113px' }} />

      <Button onClick={handleCheckout} sx={{ width: '100%' }}>
        Checkout
      </Button>
    </Box>
  );
};
