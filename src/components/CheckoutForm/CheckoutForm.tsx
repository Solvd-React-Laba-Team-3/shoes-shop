'use client';

import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutSchema } from './checkout.schema';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  FormLabel,
  ToggleButtonGroup,
  Divider,
  TextField,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { LabeledTextfield, Link, MenuItem, ToggleButton } from '../ui';
import { theme } from '@/providers/ThemeProvider';
import PaymentIcon from '@mui/icons-material/Payment';
import GoogleIcon from '@mui/icons-material/Google';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { splitProducts } from '@/lib/utils/splitProducts/splitProducts';
import { StrepiProduct } from '@/types/StrepiProduct';
import { StyledInputLabel } from '../ProductForm/productForm.styles';

type CheckoutProps = {
  discountCode?: string;
  discountAmount?: number;
  amount: number;
  products: StrepiProduct[];
};

export const CheckoutForm: FC<CheckoutProps> = ({
  discountCode,
  discountAmount,
  amount,
  products,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCardFields, setShowCardFields] = useState(true);
  const methods = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      state: '',
      zipCode: '',
      address: '',
      paymentMethod: 'card',
      discountCode: discountCode ?? '',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const paymentMethods = [
    { value: 'card', text: 'Card', icon: PaymentIcon },
    { value: 'googlePay', text: 'Google Pay', icon: GoogleIcon },
    { value: 'cashApp', text: 'Cash App Pay', icon: MoneyIcon },
    { value: 'afterPay', text: 'After Payment', icon: ScheduleIcon },
  ];

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  const onSubmit = async (data: CheckoutSchema) => {
    const orderNumber = Date.now();
    const productChunks = splitProducts(products);
    const productsMetadata = productChunks.reduce(
      (acc, chunk, i) => {
        acc[`products${i + 1}`] = chunk;
        return acc;
      },
      {} as Record<string, string>
    );

    try {
      setServerError(null);
      const body = {
        ...data,
        amount: amount,
        discountCode: discountCode || undefined,
        orderNumber,
        discountAmount: discountAmount || undefined,
        productsMetadata,
      };

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const { clientSecret } = await res.json();

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: `${data.name} ${data.surname}`,
            email: data.email,
          },
        },
      });

      if (result.error) {
        setServerError(result.error.message ?? 'Payment failed');
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        elements.getElement(CardElement)?.clear();
        router.push(`/order/?order=${encodeURIComponent(orderNumber)}`);
      }
    } catch {
      methods.reset();
      router.push(`/order/?order=${encodeURIComponent(orderNumber)}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ maxWidth: 800 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register('name')}
              error={!!errors.name}
              placeholder="Type your name..."
              errorMessage={errors.name?.message}
              reserveErrorSpace
            />
            <LabeledTextfield
              label="Surname"
              {...register('surname')}
              error={!!errors.surname}
              placeholder="Type your surname..."
              errorMessage={errors.surname?.message}
              reserveErrorSpace
            />
            <LabeledTextfield
              id="email"
              label="Email"
              placeholder="example@gmail.com"
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
              reserveErrorSpace
            />
            <LabeledTextfield
              label="Phone number"
              {...register('phone')}
              error={!!errors.phone}
              placeholder="(54) 9 114180-1332"
              errorMessage={errors.phone?.message}
              reserveErrorSpace
            />
          </Box>

          <Divider sx={{ mt: 5, mb: 2 }} />

          <Typography variant="h6" sx={{ mt: 9, mb: 3 }}>
            Shipping info
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '24px',
            }}
          >
            <Controller
              name="country"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <StyledInputLabel
                    shrink
                    error={!!errors.country}
                    sx={{ marginTop: '10px' }}
                  >
                    Country
                  </StyledInputLabel>

                  <TextField
                    {...field}
                    select
                    size="small"
                    fullWidth
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  >
                    {[
                      'Argentina',
                      'Brazil',
                      'Mexico',
                      'Poland',
                      'Ukraine',
                      'USA',
                    ].map((country) => (
                      <MenuItem
                        key={country}
                        value={country}
                        sx={{
                          height: '40px',
                          fontSize: '16px',
                        }}
                      >
                        {country}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            />
            <LabeledTextfield
              label="City"
              {...register('city')}
              error={!!errors.city}
              placeholder="New York"
              errorMessage={errors.city?.message}
              reserveErrorSpace
            />
            <LabeledTextfield
              label="State"
              {...register('state')}
              error={!!errors.state}
              placeholder="New York"
              errorMessage={errors.state?.message}
              reserveErrorSpace
            />
            <LabeledTextfield
              label="Zip Code"
              {...register('zipCode')}
              error={!!errors.zipCode}
              placeholder="3490583"
              errorMessage={errors.zipCode?.message}
              reserveErrorSpace
            />
          </Box>
          <LabeledTextfield
            label="Address"
            {...register('address')}
            error={!!errors.address}
            errorMessage={errors.address?.message}
            reserveErrorSpace
            placeholder="Street, appartment, block"
            maxWidth="800px"
            sx={{ width: '100%' }}
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
                  {paymentMethods.map(({ value, text, icon: Icon }) => (
                    <ToggleButton
                      key={value}
                      value={value}
                      sx={{
                        height: '100px',
                        width: '170px',
                        fontWeight: 500,
                        textTransform: 'none',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        gap: '10px',
                        paddingLeft: '24px',
                        borderRadius: '12px',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          transform: 'scale(1.05)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                          borderColor: theme.palette.action.active,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        },
                      }}
                      onClick={() => setShowCardFields(true)}
                    >
                      {Icon && <Icon />}
                      {text}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Button
                  variant="outlined"
                  disableRipple
                  onClick={() => setShowCardFields((prev) => !prev)}
                  sx={{
                    height: '100px',
                    width: '72px',
                    borderColor: theme.palette.secondary.dark,
                    transition: 'transform 0.2s',
                    fontSize: '24px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      transform: 'scale(1.05)',
                    },
                    color: theme.palette.secondary.main,
                  }}
                >
                  {showCardFields ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowUpIcon />
                  )}
                </Button>
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
                  options={{
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

          {serverError && (
            <FormLabel
              sx={{
                color: 'error.main',
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <WarningAmber fontSize="small" />
              {serverError}
            </FormLabel>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            disabled={isSubmitting}
          >
            Confirm & Pay
          </Button>
        </form>
        <Divider sx={{ mt: 6, mb: 2 }} />
      </Box>
    </FormProvider>
  );
};
