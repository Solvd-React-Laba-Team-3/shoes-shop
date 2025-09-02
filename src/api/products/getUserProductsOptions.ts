import { fetchApi } from '@/lib/utils';
import { User } from '@/types/User';
import { queryOptions } from '@tanstack/react-query';
import { Product } from '@/types/Product';

type UserProductsResponse = User & {
  products: Product[];
};

const getUserProducts = async (token: string) =>
  await fetchApi<UserProductsResponse>({
    endpoint: '/users/me',
    method: 'GET',
    token,
    queryParams: {
      populate: {
        products: {
          populate: '*',
        },
      },
    },
  }).then((res) => res.products);

export const getUserProductsOptions = (token: string) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['profile-products'],
    queryFn: () => getUserProducts(token),
  });
