import { z } from 'zod';

export const OrderItemSchema = z.object({
    order_id: z.coerce.number().int().positive('Order ID must be a positive integer'),
    product_id: z.coerce.number().int().positive('Product ID must be a positive integer'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
    price_at_purchase: z.coerce.number().positive('Price at purchase must be a positive number'),
});

export const CreatingOrderSchema = z.object({
    user_id: z.coerce.number().int().positive('User ID must be a positive integer'),
    receiver_name: z.string().min(1, 'Receiver name is required'),
    shipping_address: z.string().min(1, 'Shipping address is required'),
    phone_number: z.string().min(10, 'Phone number must be at least 10 characters long'),
    email: z.string().email('Invalid email format'),
    total_amount: z.coerce.number().positive('Total amount must be a positive number').optional(),
    payment_method_id: z.coerce.number().int().positive('Payment method ID must be a positive integer'),
    items: z.array(z.number()).min(1, 'At least one order item is required'),
    order_at: z.string().datetime({ offset: true }).nonempty(),
});

export type CreatingOrderRequest = z.infer<typeof CreatingOrderSchema>;
export type OrderItemRequest = z.infer<typeof OrderItemSchema>;

export const OrderSchema = {
    creating: CreatingOrderSchema,
    item: OrderItemSchema,
};