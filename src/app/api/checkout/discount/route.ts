import { DiscountResponse } from '@/types/api/DiscountResponse';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: Request) {
  const { code, total } = await req.json();

  if (!code || typeof total !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code: code,
      active: true,
      limit: 1,
    });

    const match = promotionCodes.data[0];

    if (!match || !match.coupon) {
      return NextResponse.json({
        valid: false,
        discountedTotal: total,
        discountAmount: 0,
      });
    }

    const coupon = match.coupon as Stripe.Coupon;

    if (!coupon.id) {
      return NextResponse.json({
        valid: false,
        discountedTotal: total,
        discountAmount: 0,
      });
    }

    const result: DiscountResponse = {
      valid: true,
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

    return NextResponse.json({
      ...result,
      discountedTotal,
      discountAmount,
    });
  } catch (e) {
    console.error('Stripe error:', e);
    return NextResponse.json(
      {
        valid: false,
        discountedTotal: total,
        discountAmount: 0,
      },
      { status: 500 }
    );
  }
}
