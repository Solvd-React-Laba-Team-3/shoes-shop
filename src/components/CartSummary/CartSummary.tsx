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
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface CartSummaryProps {
  checkout?: boolean;
  onConfirmAndPay?: () => void;
  taxPercent?: number;
  shippingAmount?: number;
}

export const CartSummary = ({
  checkout = false,
  onConfirmAndPay,
  taxPercent = 17,
  shippingAmount = 20,
}: CartSummaryProps) => {
  const router = useRouter();
  const { subtotal, discountAmount, discountCode, isLoading } = useCart();
  const { value: promoOpen, setValue: setPromoOpen } = useLocalStorage<boolean>(
    'promoOpen',
    false
  );

  const [isEditing, setIsEditing] = useState(false);

  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalWithDiscount * taxPercent) / 100;
  const finalTotal = subtotalWithDiscount + taxAmount + shippingAmount;

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
    if (checkout && onConfirmAndPay) {
      onConfirmAndPay();
    } else {
      router.push('/checkout');
    }
  };

  // Responsividad
  const isSmall = useMediaQuery('(max-width:400px)');
  const isMedium = useMediaQuery('(min-width:400px) and (max-width:1280px)');

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
          flexWrap: 'wrap',
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
          flexWrap: 'wrap',
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
          flexWrap: 'wrap',
          margin: '20px 0',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          Tax {checkout ? `(${taxPercent}%)` : ''}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 400 }}>
          {checkout ? `$${taxAmount.toFixed(2)}` : '-'}
        </Typography>
      </Box>

      {!checkout && (
        <>
          <Divider />
          <Typography variant="caption">
            Shipping and tax will be calculated at checkout.
          </Typography>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          margin: '20px 0',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Total
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {checkout
            ? `$${finalTotal.toFixed(2)}`
            : discountAmount > 0
              ? `$${(subtotal - discountAmount).toFixed(2)}`
              : `$${subtotal.toFixed(2)}`}
        </Typography>
      </Box>

      <Divider sx={{ mb: { xs: 4, md: '22px' } }} />
      <Box component="form" onSubmit={handleCheckout}>
        <Button
          disabled={isLoading || isPending || subtotal === 0}
          type="submit"
          size={isSmall ? 'small' : isMedium ? 'medium' : 'large'}
          sx={{ width: '100%' }}
        >
          {checkout ? 'Confirm & Pay' : 'Checkout'}
        </Button>
      </Box>
    </Box>
  );
};
