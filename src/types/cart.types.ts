import { z } from 'zod';

// export interface CartItem {
//   cart_item_id: number;
//   user_id: number;
//   product_id: number;
//   quantity: number;
//   added_at: string;
// }

const CartItemSchema = z.object({
  cart_item_id: z.number().min(1).optional(),
  user_id: z.number().min(1),
  product_id: z.number().min(1),
  quantity: z.number().min(1).default(1),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export const CartSchemas = {
  cartItem: CartItemSchema,
};