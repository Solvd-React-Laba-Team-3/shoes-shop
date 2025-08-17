import { useMutation } from '@tanstack/react-query';
import { DiscountBody } from '@/types/api/DiscountBody';
import { DiscountResponse } from '@/types/api/DiscountResponse';
import { applyDiscount } from './applyDiscount';
import { CartSchema } from '@/components/CartSummary/cart.schema';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

interface UseApplyDiscountProps {
  subtotal: number;
  taxPercent: number;
  shippingAmount: number;
  setDiscount: (code: string, amount: number) => void;
  clearDiscount: () => void;
  setError: UseFormSetError<CartSchema>;
  clearErrors: UseFormClearErrors<CartSchema>;
  onCartSummaryChange?: (
    total: number,
    discount: number,
    code?: string
  ) => void;
}

export const useApplyDiscount = ({
  subtotal,
  taxPercent,
  shippingAmount,
  setDiscount,
  clearDiscount,
  setError,
  clearErrors,
  onCartSummaryChange,
}: UseApplyDiscountProps) => {
  return useMutation<DiscountResponse, Error, DiscountBody>({
    mutationFn: applyDiscount,
    onSuccess: (result, variables) => {
      if (result.valid) {
        let newDiscountAmount = 0;

        if (result.type === 'amount' && result.amountOff) {
          newDiscountAmount = result.amountOff;
        } else if (result.type === 'percent' && result.percentOff) {
          newDiscountAmount = (subtotal * result.percentOff) / 100;
        }

        setDiscount(result.code ?? variables.code, newDiscountAmount);
        clearErrors('promoCode');

        const subtotalWithNewDiscount = subtotal - newDiscountAmount;
        const taxWithNewDiscount = (subtotalWithNewDiscount * taxPercent) / 100;
        const finalTotalWithNewDiscount =
          subtotalWithNewDiscount + taxWithNewDiscount + shippingAmount;

        onCartSummaryChange?.(
          finalTotalWithNewDiscount,
          newDiscountAmount,
          result.code ?? variables.code
        );
      } else {
        setError('promoCode', {
          type: 'manual',
          message: 'Invalid promo code',
        });
        clearDiscount();

        onCartSummaryChange?.(
          subtotal + (subtotal * taxPercent) / 100 + shippingAmount,
          0,
          undefined
        );
      }
    },
    onError: () => {
      setError('promoCode', {
        type: 'manual',
        message: 'Error. Try again.',
      });
      clearDiscount();

      onCartSummaryChange?.(
        subtotal + (subtotal * taxPercent) / 100 + shippingAmount,
        0,
        undefined
      );
    },
  });
};
