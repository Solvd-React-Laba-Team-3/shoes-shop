import { queryOptions } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';

interface ShippingTaxData {
  shippingAmount: number;
  taxPercent: number;
}

export const getShippingTaxOptions = (country: string) =>
  queryOptions({
    queryKey: ['shipping-tax', country],
    queryFn: async (): Promise<ShippingTaxData> => {
      return await fetchApi<ShippingTaxData>({
        endpoint: `/checkout/shipping-and-tax?country=${country}`,
        method: 'GET',
        apiRoute: true,
      });
    },
    enabled: Boolean(country),
  });
