import { DiscountResult } from '@/types/DiscountResult';

export function applyDiscount(
  total: number,
  discount: DiscountResult
): { discountedTotal: number; discountAmount: number } {
  if (!discount.valid) {
    return { discountedTotal: total, discountAmount: 0 };
  }

  let discountAmount = 0;

  if (discount.type === 'percent' && discount.percentOff) {
    discountAmount = Math.round((total * discount.percentOff) / 100);
  } else if (discount.type === 'amount' && discount.amountOff) {
    discountAmount = Math.min(discount.amountOff, total);
  }

  const discountedTotal = total - discountAmount;

  return { discountedTotal, discountAmount };
}
