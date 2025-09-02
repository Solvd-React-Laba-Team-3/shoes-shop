import { z } from 'zod';

export const cartSchema = z.object({
  promoCode: z.string().min(1, 'Invalid promo code'),
});

export type CartSchema = z.infer<typeof cartSchema>;
