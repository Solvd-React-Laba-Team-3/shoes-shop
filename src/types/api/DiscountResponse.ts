export interface DiscountResponse {
  code?: string;
  type?: 'percent' | 'amount';
  amountOff?: number;
  percentOff?: number;
  discountedTotal?: number;
  discountAmount?: number;
}
