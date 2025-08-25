import { infiniteQueryOptions } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { fetchApi } from '@/lib/utils';
import type { Order } from '@/types/Order';

type OrderResponse = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

export const getOrdersOptions = () =>
  infiniteQueryOptions({
    queryKey: ['orders'],
    queryFn: async ({ pageParam = 1 }) => {
      const session = await getSession();

      if (!session) {
        return {
          orders: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            hasMore: false,
          },
        };
      }

      const response = await fetchApi<OrderResponse>({
        endpoint: `/orders?userId=${session.user.id}&page=${pageParam}&limit=10`,
        method: 'GET',
        apiRoute: true,
      });

      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
