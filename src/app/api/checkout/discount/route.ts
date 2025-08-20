import { DiscountResponse } from '@/types/api/DiscountResponse';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const { code, total } = await req.json();

  if (!code || typeof total !== 'number') {
    return NextResponse.json(
      { error: { message: 'Invalid promo code' } },
      { status: 400 }
    );
  }

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    });

    const match = promotionCodes.data[0];
    const coupon = match.coupon as Stripe.Coupon;

    const result: DiscountResponse = {
      code: match.code as string,
      type: coupon.amount_off ? 'amount' : 'percent',
      amountOff: coupon.amount_off ? coupon.amount_off / 100 : undefined,
      percentOff: coupon.percent_off ?? undefined,
    };

    let discountAmount = 0;
    if (result.type === 'percent' && result.percentOff) {
      discountAmount = (total * result.percentOff) / 100;
    } else if (result.type === 'amount' && result.amountOff) {
      discountAmount = Math.min(result.amountOff, total);
    }

    const discountedTotal = total - discountAmount;

    if (discountAmount > total * 0.5) {
      return NextResponse.json(
        { error: { message: 'Insufficient subtotal' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ...result,
      discountedTotal,
      discountAmount,
    });
  } catch (e) {
    console.error('Stripe error:', e);
    return NextResponse.json(
      {
        error: { message: 'Invalid promo code' },
      },
      { status: 404 }
    );
  }
}
