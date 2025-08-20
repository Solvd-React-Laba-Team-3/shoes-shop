'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CheckoutSchema } from '../../app/checkout/checkout.schema';
import { FC, useState } from 'react';
import { Box, Typography, ToggleButtonGroup, Divider } from '@mui/material';
import {
  FormErrorMessage,
  LabeledTextfield,
  Link,
  MenuItem,
  Select,
} from '../ui';
import { theme } from '@/providers/ThemeProvider';
import PaymentIcon from '@mui/icons-material/Payment';
import GoogleIcon from '@mui/icons-material/Google';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CardElement } from '@stripe/react-stripe-js';
import { StyledInputLabel } from '../ProductForm/productForm.styles';
import { shippingCountries } from '@/constants/shippingCountries';
import {
  StyledChevronButton,
  StyledPaymentMethod,
} from './checkoutForm.styles';

interface CheckoutProps {
  error: boolean;
  cardError: string | null | undefined;
  setCardError: (error: string | null | undefined) => void;
}

const paymentMethods = [
  { value: 'card', label: 'Card', icon: PaymentIcon },
  { value: 'googlePay', label: 'Google Pay', icon: GoogleIcon },
  { value: 'cashApp', label: 'Cash App Pay', icon: MoneyIcon },
  { value: 'afterPay', label: 'After Payment', icon: ScheduleIcon },
];

export const CheckoutForm: FC<CheckoutProps> = ({
  error,
  cardError,
  setCardError,
}) => {
  const [showCardFields, setShowCardFields] = useState(true);

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
    <Box sx={{ maxWidth: 800 }}>
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

      <Typography variant="h6" sx={{ mt: 8, mb: 3 }}>
        Personal info
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
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

      <Divider sx={{ mt: 5, mb: 2 }} />

      <Typography variant="h6" sx={{ mt: 9, mb: 3 }}>
        Shipping info
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
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
          label="State"
          placeholder="New York"
          errorMessage={errors.state?.message}
          {...register('state')}
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
        sx={{ width: '100%', maxWidth: '800px' }}
        {...register('address')}
      />

      <Divider sx={{ mt: 6, mb: 2 }} />

      <Typography variant="h6" sx={{ mt: 9, mb: 3 }}>
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
                if (newValue !== null) {
                  field.onChange(newValue);
                }
              }}
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {paymentMethods.map(({ value, label, icon: Icon }) => (
                <StyledPaymentMethod
                  key={value}
                  value={value}
                  onClick={() => setShowCardFields(true)}
                >
                  <Icon />
                  {label}
                </StyledPaymentMethod>
              ))}
            </ToggleButtonGroup>
            <StyledChevronButton
              variant="outlined"
              disableRipple
              onClick={() => setShowCardFields((prev) => !prev)}
            >
              {showCardFields ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </StyledChevronButton>
          </Box>
        )}
      />

      {paymentMethod === 'card' && showCardFields && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.secondary.dark}`,
              borderRadius: '8px',
              p: 2,
              maxWidth: '100%',
              height: '56px',
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
        </Box>
      )}
      <FormErrorMessage message={cardError} />
      {error && <FormErrorMessage message="Payment failed" />}
      <Divider sx={{ mt: 6, mb: 2 }} />
    </Box>
  );
};
