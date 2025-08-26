'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CheckoutSchema } from '../../app/checkout/checkout.schema';
import { FC } from 'react';
import { Box, Typography, ToggleButtonGroup, Divider } from '@mui/material';
import {
  FormErrorMessage,
  LabeledTextfield,
  Link,
  MenuItem,
  Select,
  Tooltip,
} from '../ui';
import { theme } from '@/providers/ThemeProvider';
import PaymentIcon from '@mui/icons-material/Payment';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { CardElement } from '@stripe/react-stripe-js';
import { StyledInputLabel } from '../ProductForm/productForm.styles';
import { shippingCountries } from '@/constants/shippingCountries';
import { StyledPaymentMethod } from './checkoutForm.styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type PaymentMethod = 'card' | 'googlePay' | 'applePay' | 'link';

interface CheckoutProps {
  error: boolean;
  cardError: string | null | undefined;
  setCardError: (error: string | null | undefined) => void;
  availablePaymentMethods: PaymentMethod[];
}

const paymentMethods = [
  { value: 'card', label: 'Card', icon: PaymentIcon },
  { value: 'googlePay', label: 'Google Pay', icon: GoogleIcon },
  { value: 'applePay', label: 'Apple Pay', icon: AppleIcon },
  { value: 'link', label: 'Link', icon: ChevronRightIcon },
];

export const CheckoutForm: FC<CheckoutProps> = ({
  error,
  cardError,
  setCardError,
  availablePaymentMethods,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CheckoutSchema>();

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Link
        href="/cart"
        sx={{
          textDecoration: 'underline',
          ...theme.typography.caption,
          color: theme.palette.grey[600],
        }}
      >
        Back to cart
      </Link>
      <Typography variant="h2" sx={{ marginTop: theme.spacing(3) }}>
        Checkout
      </Typography>

      <Typography variant="h6" sx={{ mt: { xs: 4, md: 8 }, mb: 3 }}>
        Personal info
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: '0px', md: '12px' },
        }}
      >
        <LabeledTextfield
          label="Name"
          placeholder="Type your name..."
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <LabeledTextfield
          label="Surname"
          placeholder="Type your surname..."
          errorMessage={errors.surname?.message}
          {...register('surname')}
        />
        <LabeledTextfield
          id="email"
          label="Email"
          placeholder="example@gmail.com"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <LabeledTextfield
          label="Phone number"
          placeholder="(54) 9 114180-1332"
          errorMessage={errors.phone?.message}
          {...register('phone')}
        />
      </Box>

      <Divider sx={{ mt: { xs: 2, md: 5 }, mb: 2 }} />

      <Typography variant="h6" sx={{ mt: { xs: 3, md: 9 }, mb: 3 }}>
        Shipping info
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: '0px', md: '24px' },
        }}
      >
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <StyledInputLabel shrink error={!!errors.country}>
                Country
              </StyledInputLabel>

              <Select
                displayEmpty
                sx={{ padding: '4px' }}
                error={!!errors.country}
                {...field}
                renderValue={(value) => {
                  if (!value)
                    return (
                      <Typography variant="body2" color="textSecondary">
                        Select country
                      </Typography>
                    );
                  return (
                    <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
                      {value as string}
                    </Typography>
                  );
                }}
              >
                {shippingCountries.map((country) => (
                  <MenuItem key={country} value={country}>
                    <Typography variant="caption">{country}</Typography>
                  </MenuItem>
                ))}
              </Select>
              <FormErrorMessage message={errors.country?.message} />
            </Box>
          )}
        />
        <LabeledTextfield
          label="City"
          placeholder="New York"
          errorMessage={errors.city?.message}
          {...register('city')}
        />
        <LabeledTextfield
          label="Zip Code"
          placeholder="3490583"
          errorMessage={errors.zipCode?.message}
          {...register('zipCode')}
        />
      </Box>
      <LabeledTextfield
        label="Address"
        errorMessage={errors.address?.message}
        placeholder="Street, apartment, block"
        sx={{ width: '100%', maxWidth: '100%' }}
        {...register('address')}
      />

      <Divider sx={{ mt: 6, mb: 2 }} />

      <Typography variant="h6" sx={{ mt: { xs: 3, md: 9 }, mb: 3 }}>
        Payment info
      </Typography>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              gap: 2,
            }}
          >
            <ToggleButtonGroup
              exclusive
              value={field.value}
              onChange={(_, newValue) => {
                if (newValue !== null) field.onChange(newValue);
              }}
              sx={{
                display: 'grid',
                gap: '10px',
                width: '100%',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
              }}
            >
              {paymentMethods.map(({ value, label, icon: Icon }) => {
                const isDisabled = !availablePaymentMethods.includes(
                  value as PaymentMethod
                );

                const paymentButton = (
                  <StyledPaymentMethod
                    key={value}
                    value={value}
                    disabled={isDisabled}
                  >
                    <Icon />
                    {label}
                  </StyledPaymentMethod>
                );

                if (isDisabled) {
                  return (
                    <Tooltip
                      key={value}
                      title="Your browser doesn't support this method"
                      block
                    >
                      {paymentButton}
                    </Tooltip>
                  );
                }

                return paymentButton;
              })}
            </ToggleButtonGroup>
          </Box>
        )}
      />
      {paymentMethod === 'card' && (
        <>
          <Box
            sx={{
              border: `1px solid ${theme.palette.secondary.dark}`,
              borderRadius: '8px',
              p: 2,
              width: '100%',
              height: '56px',
              mt: 2,
            }}
          >
            <CardElement
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else if (!e.complete || e.empty) {
                  setCardError('Card number is required');
                } else {
                  setCardError(null);
                }
              }}
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    fontFamily: 'Work Sans',
                    '::placeholder': {
                      color: theme.palette.secondary.light,
                    },
                  },
                  invalid: {
                    color: 'error.main',
                  },
                },
              }}
            />
          </Box>
          <FormErrorMessage message={cardError} />
        </>
      )}
      {error && <FormErrorMessage message="Payment failed" />}
      <Divider sx={{ mt: 6, mb: 2 }} />
    </Box>
  );
};
