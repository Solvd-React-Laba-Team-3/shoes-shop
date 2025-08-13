import { useMutation } from '@tanstack/react-query';
import { DiscountBody } from '@/types/api/DiscountBody';
import { DiscountResponse } from '@/types/api/DiscountResponse';

export const APPLY_DISCOUNT_MUTATION_KEY = 'apply-discount';

export const applyDiscountFn = async (
  body: DiscountBody
): Promise<DiscountResponse> => {
  const res = await fetch('/api/checkout/discount', {
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

export const useApplyDiscount = (options?: {
  onSuccess?: (result: DiscountResponse, variables: DiscountBody) => void;
  onError?: (error: Error) => void;
}) =>
  useMutation<DiscountResponse, Error, DiscountBody>({
    mutationFn: applyDiscountFn,
    mutationKey: [APPLY_DISCOUNT_MUTATION_KEY],
    ...options,
  });
