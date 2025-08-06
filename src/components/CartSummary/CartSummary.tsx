'use client';

import React, { useState } from 'react';
import {
  Box,
  Divider,
  GlobalStyles,
  TextField,
  Typography,
} from '@mui/material';
import { Accordion } from '../ui/Accordion/Accordion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartSchema } from './CartSchema';
import type { PromoFormData } from './CartSchema';
import { Button } from '../ui';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,

  total,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PromoFormData>({
    resolver: zodResolver(CartSchema),
  });

  const [discount, setDiscount] = useState(0);

  const onApplyPromo = (data: PromoFormData) => {
    const enteredCode = data.promoCode.trim().toUpperCase();

    if (enteredCode === 'SAVE10') {
      setDiscount(10);
      clearErrors('promoCode');
      console.log('Promo code applied successfully');
    } else {
      setDiscount(0);
      setError('promoCode', {
        type: 'manual',
        message: 'Invalid promo code',
      });
    }
  };

  const handleCheckout = () => {
    console.log('Checkout button clicked');
    router.push('/profile/products');
  };

  const finalTotal = total - discount;

  return (
    <Box>
      <GlobalStyles
        styles={{
          '.MuiAccordionSummary-root': {
            width: 'auto !important',
          },
        }}
      />

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
            placeholder="Enter promo code"
            sx={{
              width: '50%',
              height: '40px',
              marginRight: '10px',
              '& .MuiInputBase-root': {
                fontSize: '16px',
              },
            }}
            {...register('promoCode')}
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
            -${discount.toFixed(2)}
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
