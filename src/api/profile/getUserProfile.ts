import { fetchApi } from '@/lib/utils';
import { User } from '@/types/User';

export const getUserProfile = async (token: string) =>
  await fetchApi<User>({
    endpoint: '/users/me',
    method: 'GET',
    token,
    queryParams: {
      populate: {
        products: {
          populate: '*',
        },
        avatar: '*',
      },
    },
  });
