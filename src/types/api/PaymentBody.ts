export interface PaymentBody {
  amount: number;
  discountAmount?: number;
  discountCode?: string;
  shippingAmount: number;
  taxPercent: number;
  orderNumber: number;
  productsMetadata: Record<string, string>;
  name: string;
  surname: string;
  email: string;
  paymentMethod: string;
}
