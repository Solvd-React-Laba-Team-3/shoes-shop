import { CartProduct } from './CartProduct';

export interface OrderHistory {
  userId: number;
  orderNumber: number;
  summary: number;
  discountAmount?: number;
  discountCode?: string;
  delivery: string;
  contactFullName: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  products: CartProduct[];
}
