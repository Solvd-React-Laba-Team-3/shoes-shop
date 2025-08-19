import { fetchApi } from '@/lib/utils';
import { User } from '@/types/User';

export const githubCallback = async (accessToken: string) =>
  await fetchApi<User>({
    endpoint: '/auth/github/callback',
    method: 'GET',
    queryParams: {
      access_token: accessToken,
    },
  });
