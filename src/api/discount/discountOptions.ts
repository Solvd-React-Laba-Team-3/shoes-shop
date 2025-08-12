import { DiscountBody } from '@/types/api/DiscountBody';
import { DiscountResponse } from '@/types/api/DiscountResponse';
export const APPLY_DISCOUNT_MUTATION_KEY = 'apply-discount';

export const applyDiscountFn = async (
  body: DiscountBody
): Promise<DiscountResponse> => {
  const res = await fetch('/api/discount', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    return { valid: false };
  }
  return json;
};
