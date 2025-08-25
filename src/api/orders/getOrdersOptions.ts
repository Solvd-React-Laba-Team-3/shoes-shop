import { queryOptions } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { fetchApi } from '@/lib/utils';
import { Order } from '@/types/Order';

type OrderResponse = Record<'orders', Order[]>;

export const getOrdersOptions = () =>
  queryOptions({
    queryKey: ['orders'],
    queryFn: async () => {
      const session = await getSession();

      if (!session) {
        return [];
      }

      const { orders } = await fetchApi<OrderResponse>({
        endpoint: `/orders?userId=${session.user.id}`,
        method: 'GET',
        apiRoute: true,
      });

      return orders;
    },
  });
