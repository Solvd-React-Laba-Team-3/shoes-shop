import { DiscountBody } from '@/types/api/DiscountBody';
import { DiscountResponse } from '@/types/api/DiscountResponse';
import { fetchApi } from '@/lib/utils';

export const applyDiscount = async (
  body: DiscountBody
): Promise<DiscountResponse> => {
  return await fetchApi<DiscountResponse>({
    endpoint: 'api/checkout/discount',
    method: 'POST',
    body,
    apiRoute: true,
  });
};
