import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: 'Checkout of Shoes',
      shipping: {
        name: `${data.name} ${data.surname}`,
        phone: data.phone,
        address: {
          line1: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.zipCode,
          country: data.country,
        },
      },
      metadata: {
        email: data.email,
        paymentMethod: data.paymentMethod,
        userId: '1234',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch {
    return;
  }
}
