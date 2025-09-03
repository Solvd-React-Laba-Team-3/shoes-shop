import type { Order } from '@/types/Order';
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
  const url = new URL(req.url);
  const customerMail = url.searchParams.get('customerMail');
  const page = Number.parseInt(url.searchParams.get('page') || '1');
  const limit = Number.parseInt(url.searchParams.get('limit') || '10');

  if (!customerMail) {
    return NextResponse.json(
      { error: 'Missing customerMail' },
      { status: 400 }
    );
  }

  try {
    const customers = await stripe.customers.list({
      email: customerMail,
      limit: 1,
    });
    if (!customers.data.length) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    if (!customers.data.length) {
      return NextResponse.json({
        orders: [],
        pagination: { page: 1, limit, total: 0, hasMore: false },
      });
    }
    const customerId = customers.data[0].id;

    const searchResults = await stripe.paymentIntents.search({
      query: `customer:'${customerId}'`,
      limit: 100,
    });

    const allOrders = (
      await Promise.all(
        searchResults.data.map(async (intent) => {
          const products = parseProducts(intent.metadata);
          if (products.length === 0) return null;

          const { receiptUrl, declineReason } = intent.latest_charge
            ? await getChargeDetails(intent.latest_charge as string)
            : { receiptUrl: null, declineReason: null };

          const {
            orderNumber,
            discountAmount,
            discountCode,
            shippingAmount,
            taxPercent,
            paymentMethod,
            omitted,
          } = intent.metadata;

          const { shipping } = intent;

          return {
            orderNumber: Number(orderNumber),
            date: new Date(intent.created * 1000).toISOString(),
            summary: intent.amount / 100,
            discountAmount: discountAmount ? Number(discountAmount) : undefined,
            discountCode: discountCode || undefined,
            delivery: shipping?.address?.line1 ?? '',
            contactFullName: shipping?.name ?? '',
            contactPhone: shipping?.phone ?? '',
            contactEmail: intent.receipt_email ?? '',
            status: intent.status,
            shippingAmount: shippingAmount ? Number(shippingAmount) : 0,
            taxPercent: taxPercent ? Number(taxPercent) : 0,
            products,
            isOmitted: omitted && omitted === 'true',
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

    const sortedOrders = allOrders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: sortedOrders.length,
        hasMore: endIndex < sortedOrders.length,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
