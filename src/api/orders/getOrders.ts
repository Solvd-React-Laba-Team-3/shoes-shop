import { OrderResponse } from '@/types/api/OrderResponse';
import { queryOptions } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { fetchApi } from '@/lib/utils';

export const getOrdersOptions = () =>
  queryOptions({
    queryKey: ['orders'],
    queryFn: async (): Promise<OrderResponse[]> => {
      const session = await getSession();
      if (!session) {
        return [];
      }

      const { orders } = await fetchApi<{ orders: OrderResponse[] }>({
        endpoint: `/api/orders?userId=${session.user.id}`,
        method: 'GET',
        apiRoute: true,
      });

      return orders;
    },
  });
