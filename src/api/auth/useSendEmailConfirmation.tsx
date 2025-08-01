import { fetchApi } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

interface SendEmailConfirmationRequestBody {
  email: string;
}

interface SendEmailConfirmationResponse {
  email: string;
  sent: boolean;
}

export const useSendEmailConfirmation = () => {
  return useMutation<
    SendEmailConfirmationResponse,
    Error,
    SendEmailConfirmationRequestBody
  >({
    mutationFn: async (body: SendEmailConfirmationRequestBody) =>
      await fetchApi<SendEmailConfirmationResponse>({
        endpoint: '/auth/send-email-confirmation',
        method: 'POST',
        body,
      }),
    onError: (error) => {
      console.error('Send email confirmation failed:', error.message);
    },
  });
};
