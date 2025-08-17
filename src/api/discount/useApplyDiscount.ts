import { useMutation } from '@tanstack/react-query';
import { DiscountResponse } from '@/types/api/DiscountResponse';
import { CartSchema } from '@/components/CartSummary/cart.schema';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import { fetchApi } from '@/lib/utils';

export interface DiscountBody {
  code: string;
  total: number;
}

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

interface UseApplyDiscountProps {
  subtotal: number;
  taxPercent: number;
  shippingAmount: number;
  setDiscount: (
    code: string,
    amount: number,
    type: 'fixed' | 'percent'
  ) => void;
  clearDiscount: () => void;
  setError: UseFormSetError<CartSchema>;
  clearErrors: UseFormClearErrors<CartSchema>;
  onCartSummaryChange?: (
    total: number,
    discount: number,
    code?: string
  ) => void;
  onAppliedSuccessfully?: () => void;
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
  onAppliedSuccessfully,
}: UseApplyDiscountProps) => {
  return useMutation<DiscountResponse, Error, DiscountBody>({
    mutationFn: applyDiscount,
    onSuccess: (result, variables) => {
      if (result.valid) {
        let newDiscountAmount = 0;

        if (result.type === 'amount' && result.amountOff) {
          newDiscountAmount = result.amountOff;

          if (newDiscountAmount > subtotal * 0.5) {
            setError('promoCode', {
              type: 'manual',
              message: 'Insufficent subtotal',
            });
            clearDiscount();
            return;
          }

          setDiscount(
            result.code ?? variables.code,
            newDiscountAmount,
            'fixed'
          );
        } else if (result.type === 'percent' && result.percentOff) {
          newDiscountAmount = (subtotal * result.percentOff) / 100;
          setDiscount(
            result.code ?? variables.code,
            newDiscountAmount,
            'percent'
          );
        }

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

        onAppliedSuccessfully?.();
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
