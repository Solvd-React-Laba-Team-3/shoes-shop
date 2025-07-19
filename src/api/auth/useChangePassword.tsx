import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';
import { useMutation } from '@tanstack/react-query';

interface ChangePasswordRequestBody {
  password: string;
  currentPassword: string;
  passwordConfirmation: string;
}

export const useChangePassword = () =>
  useMutation<AuthResponse, Error, ChangePasswordRequestBody>({
    mutationFn: async (body: ChangePasswordRequestBody) =>
      await fetchApi<AuthResponse>({
        endpoint: '/auth/change-password',
        method: 'POST',
        body,
      }),
    onError: (error) => {
      console.error('Change password failed:', error.message);
    },
  });
