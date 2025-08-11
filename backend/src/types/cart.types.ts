import { z } from 'zod';

const CartItemSchema = z.object({
  product_id: z.number().min(1),
  quantity: z.number().min(1).default(1),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export const CartSchemas = {
  cartItem: CartItemSchema,
};