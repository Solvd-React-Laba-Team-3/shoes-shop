import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';
import { mutationOptions } from '@tanstack/react-query';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export const registerOptions = mutationOptions({
  mutationKey: ['register'],
  mutationFn: async (body: RegisterRequestBody) =>
    await fetchApi<AuthResponse>({
      endpoint: '/auth/local/register',
      method: 'POST',
      body,
    }),
});
