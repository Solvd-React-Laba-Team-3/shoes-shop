import { useMutation } from '@tanstack/react-query';
import { DiscountResponse } from '@/types/api/DiscountResponse';
import { CartData } from '@/components/CartSummary/cart.schema';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import { fetchApi } from '@/lib/utils';
import { useCart } from '@/lib/hooks';

interface DiscountBody {
  code: string;
  total: number;
}

export const applyDiscount = async (
  body: DiscountBody
): Promise<DiscountResponse> => {
  return await fetchApi<DiscountResponse>({
    endpoint: '/checkout/discount',
    method: 'POST',
    body,
    apiRoute: true,
  });
};

interface ApplyDiscountArgs {
  subtotal: number;
  setError: UseFormSetError<CartData>;
  clearErrors: UseFormClearErrors<CartData>;
}

export const useApplyDiscount = ({
  subtotal,
  setError,
  clearErrors,
}: ApplyDiscountArgs) => {
  const { setDiscount, clearDiscount } = useCart();

  return useMutation<DiscountResponse, Error, DiscountBody>({
    mutationFn: applyDiscount,
    onSuccess: (result, variables) => {
      let newDiscountAmount = 0;
      let discountType: 'fixed' | 'percent' = 'fixed';
      let percentOff: number | undefined;

      if (result.type === 'amount' && result.amountOff) {
        newDiscountAmount = result.amountOff;
        discountType = 'fixed';
      } else if (result.type === 'percent' && result.percentOff) {
        newDiscountAmount = (subtotal * result.percentOff) / 100;
        discountType = 'percent';
        percentOff = result.percentOff;
      }

      setDiscount(
        result.code ?? variables.code,
        newDiscountAmount,
        discountType,
        percentOff
      );

      clearErrors('promoCode');
    },
    onError: (e) => {
      setError('promoCode', {
        type: 'manual',
        message: e.message,
      });
      clearDiscount();
    },
  });
};
