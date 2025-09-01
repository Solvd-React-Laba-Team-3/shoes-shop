import { CartProduct } from './CartProduct';

export interface Order {
  userId: number;
  orderNumber: number;
  date: string;
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
  decline_reason?: string;
  latest_charge?: string;
  isOmitted?: boolean;
}
