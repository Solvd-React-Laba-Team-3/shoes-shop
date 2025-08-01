import { z } from 'zod';

const baseSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  surname: z.string().min(1, { message: 'Surname is required' }),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, { message: 'Phone number is too short' })
    .max(20, { message: 'Phone number is too long' }),

  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z.string().regex(/^\d{4,10}$/, { message: 'Invalid Zip Code' }),
  address: z.string().min(1, { message: 'Address is required' }),
});

const cardPaymentSchema = baseSchema.extend({
  paymentMethod: z.literal('card'),
  cardNumber: z
    .string()
    .regex(/^\d{12,19}$/, { message: 'Invalid card number' }),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
    message: 'MM/YY format required',
  }),
  securityCode: z
    .string()
    .regex(/^\d{3,4}$/, { message: 'CVC must be 3 or 4 digits' }),
  paymentCountry: z.string().min(1, { message: 'Country is required' }),
});

const otherPaymentSchema = baseSchema.extend({
  paymentMethod: z.enum(['googlePay', 'cashApp', 'afterPay']),
  cardNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  securityCode: z.string().optional(),
  paymentCountry: z.string().optional(),
});

export const checkoutSchema = z.discriminatedUnion('paymentMethod', [
  cardPaymentSchema,
  otherPaymentSchema,
]);

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
