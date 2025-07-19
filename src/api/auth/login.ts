import { fetchApi } from '@/lib/utils';
import { AuthResponse } from '@/types/api/AuthResponse';

interface LoginRequestBody {
  identifier: string;
  password: string;
}

export const login = async (body: LoginRequestBody) =>
  await fetchApi<AuthResponse>({
    endpoint: '/auth/local',
    method: 'POST',
    body,
  });
