import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!country) {
    return NextResponse.json({ error: 'Missing country' }, { status: 400 });
  }

  try {
    const taxRates = await stripe.taxRates.list({ active: true, limit: 100 });
    const taxMatch = taxRates.data.find(
      (rate) => rate.metadata?.country?.toLowerCase() === country.toLowerCase()
    );

    const shippingRates = await stripe.shippingRates.list({
      active: true,
      limit: 100,
    });
    const shippingMatch = shippingRates.data.find(
      (rate) => rate.metadata?.country?.toLowerCase() === country.toLowerCase()
    );

    const taxPercent = taxMatch?.percentage ?? 17;
    const shippingAmount = shippingMatch?.fixed_amount?.amount
      ? shippingMatch.fixed_amount.amount / 100
      : 20;

    return NextResponse.json({ shippingAmount, taxPercent });
  } catch {
    return NextResponse.json(
      { shippingAmount: 20, taxPercent: 17, error: 'Stripe fetch error' },
      { status: 500 }
    );
  }
}
