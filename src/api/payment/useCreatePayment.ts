import { fetchApi } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

interface CreatePaymentResponse {
  clientSecret: string;
}

interface CreatePaymentBody {
  amount: number;
  discountAmount: number;
  discountCode?: string;
  shippingAmount: number;
  taxPercent: number;
  orderNumber: number;
  productsMetadata: Record<string, string>;
  name?: string;
  surname?: string;
  email?: string;
  paymentMethod: string;
}

export const createPayment = async (body: CreatePaymentBody) =>
  await fetchApi<CreatePaymentResponse>({
    endpoint: '/checkout/payments',
    method: 'POST',
    body,
    apiRoute: true,
  });

export const useCreatePayment = () =>
  useMutation({
    mutationFn: createPayment,
    onError: (error) => {
      console.error('Payment creation failed:', error);
    },
  });
