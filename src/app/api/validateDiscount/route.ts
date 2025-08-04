import { DiscountResult } from '@/types/DiscountResult';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export async function validateDiscountCode(
  code: string
): Promise<DiscountResult> {
  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
    });

    const match = promotionCodes.data[0];

    if (!match || !match.coupon) {
      return { valid: false };
    }

    const coupon = match.coupon;

    return {
      valid: true,
      code: match.code,
      type: coupon.amount_off ? 'amount' : 'percent',
      amountOff: coupon.amount_off ?? undefined,
      percentOff: coupon.percent_off ?? undefined,
    };
  } catch {
    return { valid: false };
  }
}
