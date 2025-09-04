import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { authOptions } from '@/constants/authConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { discountCode, discountAmount, productsMetadata, ...data } =
      await req.json();

    if (!session?.user?.id) {
      return;
    }

    const existingCustomers = await stripe.customers.list({
      email: data.email,
      limit: 1,
    });

    let customer: Stripe.Customer;

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: data.email,
        name: `${data.name} ${data.surname}`,
        phone: data.phone,
        address: {
          line1: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.zipCode,
          country: data.country,
        },
        metadata: {
          userId: session.user.id,
        },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: 'Checkout of Shoes',
      customer: customer.id,
      receipt_email: data.email,
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
        orderNumber: data.orderNumber,
        paymentMethod: data.paymentMethod,
        userId: session.user.id,
        shippingAmount: data.shippingAmount,
        taxPercent: data.taxPercent,
        ...(discountCode && { discountCode }),
        ...(discountAmount && { discountAmount }),
        ...(productsMetadata ?? {}),
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
