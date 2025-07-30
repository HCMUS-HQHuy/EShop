export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  order_id: number;
  user_id: number;
  receiver_name: string;
  shipping_address: string;
  phone_number: string;
  email: string;
  total_amount: number;
  status: OrderStatus;
  payment_method_id: number;
  created_at: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}
