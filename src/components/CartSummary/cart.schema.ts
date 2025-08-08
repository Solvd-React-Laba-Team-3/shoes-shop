import { z } from 'zod';

export const cartSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
});

export type CartSchema = z.infer<typeof cartSchema>;
