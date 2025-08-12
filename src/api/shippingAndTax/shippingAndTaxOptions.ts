import { ShippingTaxData } from '@/types/api/ShippingTaxData';
import { queryOptions } from '@tanstack/react-query';

export const GET_SHIPPING_TAX_QUERY_KEY = 'shipping-tax';

export const getShippingTaxOptions = (country: string) =>
  queryOptions({
    queryKey: [GET_SHIPPING_TAX_QUERY_KEY, country],
    queryFn: async (): Promise<ShippingTaxData> => {
      const res = await fetch(`/api/shipping-and-tax?country=${country}`);
      if (!res.ok) {
        throw new Error('Failed to fetch shipping & tax');
      }
      return res.json();
    },
    enabled: Boolean(country),
  });
