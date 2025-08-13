export type PaymentMethodName = 'Cash on Delivery' | 'Bank Transfer';

export interface PaymentMethod {
  payment_method_id: number;
  name: PaymentMethodName;
}
