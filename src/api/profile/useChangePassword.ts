import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface ChangePasswordRequestBody {
  password: string;
  currentPassword: string;
  passwordConfirmation: string;
}

export const useChangePassword = () => {
  const { data: session } = useSession();

  return useMutation<AuthResponse, Error, ChangePasswordRequestBody>({
    mutationFn: async (body: ChangePasswordRequestBody) => {
      return await fetchApi<AuthResponse>({
        endpoint: '/auth/change-password',
        method: 'POST',
        body,
        token: session?.user?.accessToken,
      });
    },
    onError: (error) => {
      console.error('Failed to change password:', error.message);
    },
  });
};
