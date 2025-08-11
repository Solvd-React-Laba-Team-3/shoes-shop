import { CartProduct } from './CartProduct';

export interface OrderHistory {
  userId: number;
  orderNumber: number;
  summary: number;
  discountAmount?: number;
  discountCode?: string;
  shippingAmount: number;
  taxPercent: number;
  delivery: string;
  contactFullName: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  products: CartProduct[];
  receipt_url?: string;
  paymentMethod: string;
}
