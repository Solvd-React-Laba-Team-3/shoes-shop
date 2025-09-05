import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';
import { useMutation } from '@tanstack/react-query';

interface ResetPasswordRequestBody {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export const useResetPassword = () =>
  useMutation<AuthResponse, Error, ResetPasswordRequestBody>({
    mutationFn: async (body: ResetPasswordRequestBody) =>
      await fetchApi<AuthResponse>({
        endpoint: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    onError: (error) => {
      console.error('Failed to reset password:', error.message);
    },
  });
