'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, LabeledTextfield } from '../ui';
import { Accordion } from '../ui/Accordion/Accordion';
import { cartSchema, CartSchema } from './cart.schema';
import { useCart, useLocalStorage } from '@/lib/hooks';
import { useApplyDiscount } from '@/api/discount/useApplyDiscount';
import { FC, FormEvent, useState } from 'react';
import { TAX_PERCENT } from '@/constants/taxPercent';
import { SHIPPING_AMOUNT } from '@/constants/shippingAmount';

interface CartSummaryProps {
  checkout?: boolean;
  taxPercent?: number;
  shippingAmount?: number;
  onOrderComplete?: () => void;
}

export const CartSummary: FC<CartSummaryProps> = ({
  checkout = false,
  taxPercent = TAX_PERCENT,
  shippingAmount = SHIPPING_AMOUNT,
  onOrderComplete,
}) => {
  const router = useRouter();
  const { value: promoOpen, setValue: setPromoOpen } = useLocalStorage<boolean>(
    'promoOpen',
    false
  );

  const { subtotal, discountAmount, discountCode, isLoading } = useCart();

  const [isEditing, setIsEditing] = useState(false);

  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalWithDiscount * taxPercent) / 100;
  const finalTotal = subtotalWithDiscount + shippingAmount + taxAmount;

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
              onClick={() => setIsEditing(true)}
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

      <Box sx={{ margin: '38px 0 20px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            Subtotal
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
              flexWrap: 'wrap',
              color: 'green',
              mt: 2,
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
            mt: 2,
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
            mt: 2,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            Tax
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            {checkout ? `$${taxAmount.toFixed(2)}` : '-'}
          </Typography>
        </Box>
      </Box>

      {!checkout && (
        <>
          <Divider sx={{ mb: '10px' }} />
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', mb: '10px' }}
          >
            Shipping and tax will be calculated at checkout.
          </Typography>
        </>
      )}

      <Divider />

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
          ${(checkout ? finalTotal : subtotalWithDiscount).toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ mb: { xs: 4, md: '22px' } }} />
      <Box
        component="form"
        onSubmit={checkout ? onOrderComplete : handleCheckout}
      >
        <Button
          disabled={isLoading || isPending || subtotal === 0}
          type="submit"
          sx={{ width: '100%' }}
        >
          {checkout ? 'Confirm & Pay' : 'Checkout'}
        </Button>
      </Box>
    </Box>
  );
};
