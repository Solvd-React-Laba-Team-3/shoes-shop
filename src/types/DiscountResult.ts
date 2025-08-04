export interface DiscountResult {
  valid: boolean;
  code?: string;
  type?: 'percent' | 'amount';
  amountOff?: number;
  percentOff?: number;
}
