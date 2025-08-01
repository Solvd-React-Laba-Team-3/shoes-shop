import { fetchApi } from '@/lib/utils';
import { OkResponse } from '@/types/api/OkResponse';
import { useMutation } from '@tanstack/react-query';

interface ForgotPasswordRequestBody {
  email: string;
}

export const useForgotPassword = () => {
  return useMutation<OkResponse, Error, ForgotPasswordRequestBody>({
    mutationFn: async (body: ForgotPasswordRequestBody) =>
      await fetchApi<OkResponse>({
        endpoint: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    onError: (error) => {
      console.error('Forgot password failed:', error.message);
    },
  });
};
