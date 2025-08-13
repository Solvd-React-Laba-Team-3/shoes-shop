import { OrderResponse } from '@/types/api/OrderResponse';
import { queryOptions } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

export const GET_ORDERS_QUERY_KEY = 'orders';

export const getOrdersOptions = () =>
  queryOptions({
    queryKey: [GET_ORDERS_QUERY_KEY],
    queryFn: async (): Promise<OrderResponse[]> => {
      const session = await getSession();
      if (!session) {
        return [];
      }
      const res = await fetch(`/api/orders?userId=${session.user.id}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        return [];
      }
      const { orders } = await res.json();
      return orders;
    },
  });
