import { z } from 'zod';

export const checkoutSchema = z.object({
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
  discountCode: z.string().optional().or(z.literal('')),
  paymentMethod: z.enum(['card', 'googlePay', 'cashApp', 'afterPay']),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
