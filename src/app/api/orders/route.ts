import { Order } from '@/types/Order';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function parseProducts(metadata: Record<string, string>) {
  return Array.from({ length: 50 }, (_, i) => {
    const chunk = metadata[`products${i + 1}`];
    if (!chunk) return null;
    try {
      return JSON.parse(chunk);
    } catch {
      return null;
    }
  })
    .filter(Boolean)
    .flat();
}

async function getChargeDetails(latestChargeId?: string) {
  if (!latestChargeId) return { receiptUrl: null, declineReason: null };
  try {
    const charge = await stripe.charges.retrieve(latestChargeId);
    return {
      receiptUrl: charge.receipt_url ?? null,
      declineReason: charge.outcome?.reason ?? null,
    };
  } catch {
    return { receiptUrl: null, declineReason: null };
  }
}

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const searchResults = await stripe.paymentIntents.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 100,
    });

    const orders = (
      await Promise.all(
        searchResults.data.map(async (intent) => {
          const products = parseProducts(intent.metadata);
          if (products.length === 0) return null;

          const { receiptUrl, declineReason } = await getChargeDetails(
            intent.latest_charge as string
          );

          const {
            userId,
            orderNumber,
            discountAmount,
            discountCode,
            shippingAmount,
            taxPercent,
            email,
            paymentMethod,
          } = intent.metadata;
          const { shipping } = intent;

          return {
            userId: Number(userId),
            orderNumber: Number(orderNumber),
            date: new Date(intent.created * 1000).toISOString(),
            summary: intent.amount / 100,
            discountAmount: discountAmount ? Number(discountAmount) : undefined,
            discountCode: discountCode || undefined,
            delivery: shipping?.address?.line1 ?? '',
            contactFullName: shipping?.name ?? '',
            contactPhone: shipping?.phone ?? '',
            contactEmail: email ?? '',
            status: intent.status,
            shippingAmount: shippingAmount ? Number(shippingAmount) : 0,
            taxPercent: taxPercent ? Number(taxPercent) : 0,
            products,
            receipt_url: receiptUrl,
            paymentMethod,
            decline_reason: declineReason,
            latest_charge: intent.latest_charge,
          } as Order;
        })
      )
    )
      .filter(Boolean)
      .filter(
        (order) =>
          order!.status === 'succeeded' ||
          order!.status === 'canceled' ||
          (order!.status === 'requires_payment_method' &&
            order!.decline_reason === null)
      ) as Order[];

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
