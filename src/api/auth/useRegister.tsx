import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';
import { useMutation } from '@tanstack/react-query';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export const useRegister = () =>
  useMutation<AuthResponse, Error, RegisterRequestBody>({
    mutationFn: async (body: RegisterRequestBody) =>
      await fetchApi<AuthResponse>({
        endpoint: '/auth/local/register',
        method: 'POST',
        body,
      }),
    onError: (error) => {
      console.error('Failed to register:', error.message);
    },
  });
