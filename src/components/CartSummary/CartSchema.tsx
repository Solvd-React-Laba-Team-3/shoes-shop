import { z } from 'zod';

export const CartSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
});

export type PromoFormData = z.infer<typeof CartSchema>;
