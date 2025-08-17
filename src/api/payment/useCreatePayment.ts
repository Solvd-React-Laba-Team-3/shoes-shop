import { fetchApi } from '@/lib/utils';
import { PaymentBody } from '@/types/api/PaymentBody';
import { useMutation } from '@tanstack/react-query';

export const createPayment = async (body: PaymentBody) => {
  return await fetchApi<{ clientSecret: string }>({
    endpoint: '/api/checkout/payments',
    method: 'POST',
    body,
    apiRoute: true,
  });
};

export const useCreatePayment = () =>
  useMutation({
    mutationFn: createPayment,
    onError: (error) => {
      console.error('Payment creation failed:', error);
    },
  });
