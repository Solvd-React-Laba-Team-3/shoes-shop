import { OrderHistory } from '@/types/OrderHistory';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const searchResults = await stripe.paymentIntents.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 100,
    });

    const ordersWithReceipts = await Promise.all(
      searchResults.data.map(async (intent) => {
        const products = [];

        for (let i = 1; i <= 50; i++) {
          const chunk = intent.metadata[`products${i}`];
          if (!chunk) break;

          try {
            const parsed = JSON.parse(chunk);
            products.push(...parsed);
          } catch {}
        }

        if (products.length === 0) return null;
        let receiptUrl = null;
        if (intent.latest_charge) {
          try {
            const charge = await stripe.charges.retrieve(
              intent.latest_charge as string
            );
            receiptUrl = charge.receipt_url;
          } catch {}
        }

        return {
          userId: Number(intent.metadata.userId),
          orderNumber: Number(intent.metadata.orderNumber),
          summary: intent.amount / 100,
          discountAmount: intent.metadata.discountAmount
            ? Number(intent.metadata.discountAmount)
            : undefined,
          discountCode: intent.metadata.discountCode
            ? intent.metadata.discountCode
            : undefined,
          delivery: intent.shipping?.address?.line1 ?? '',
          contactFullName: intent.shipping?.name ?? '',
          contactPhone: intent.shipping?.phone ?? '',
          contactEmail: intent.metadata.email ?? '',
          status: intent.status,
          shippingAmount: intent.metadata.shippingAmount
            ? Number(intent.metadata.shippingAmount)
            : 0,
          taxPercent: intent.metadata.taxPercent
            ? Number(intent.metadata.taxPercent)
            : 0,
          products,
          receipt_url: receiptUrl,
        };
      })
    );

    const orders = ordersWithReceipts.filter(
      (order) => order !== null
    ) as OrderHistory[];

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
