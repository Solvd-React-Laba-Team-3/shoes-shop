import { PaymentBody } from '@/types/api/PaymentBody';

export const POST_PAYMENT_MUTATION_KEY = 'post-payment';

export const postPaymentFn = async (body: PaymentBody) => {
  const res = await fetch('/api/checkout/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const resJson = await res.json();

  if (!res.ok) {
    return;
  }

  return resJson;
};
