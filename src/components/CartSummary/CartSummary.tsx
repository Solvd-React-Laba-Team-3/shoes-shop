'use client';

import React, { useState } from 'react';
import {
  Box,
  Divider,
  GlobalStyles,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { Accordion } from '../ui/Accordion/Accordion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartSchema } from './CartSchema';
import type { PromoFormData } from './CartSchema';

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  tax,
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
    <Box sx={{ marginLeft: '166px' }}>
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
          {subtotal > 0 ? 'Subtotal' : 'Total'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${subtotal.toFixed(2)}
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
          {shipping > 0 ? 'Shipping' : 'Delivery'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${shipping.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {tax > 0 ? 'Tax' : 'Discount'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          ${tax.toFixed(2)}
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
        <Typography variant="h3" sx={{ fontWeight: 600, maxWidth: '10%' }}>
          {discount > 0 ? 'Discounted Total' : 'Total'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          ${finalTotal.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ marginBottom: '113px' }} />

      <Button onClick={handleCheckout}>Checkout</Button>
    </Box>
  );
};
