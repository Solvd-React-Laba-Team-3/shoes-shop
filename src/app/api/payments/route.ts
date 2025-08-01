import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.amount || typeof data.amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      description: 'Checkout of Shoes',
      shipping: {
        name: `${data.name} ${data.surname}`,
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
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        userId: '1234',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    console.error('Error on POST /payments:', error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
