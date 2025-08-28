import { z } from 'zod';
import { PAYMENT_METHOD } from './common';

export const OrderItemSchema = z.object({
    orderId: z.coerce.number().int().positive('Order ID must be a positive integer'),
    productId: z.coerce.number().int().positive('Product ID must be a positive integer'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
    priceAtPurchase: z.coerce.number().positive('Price at purchase must be a positive number'),
});

export const ItemInCartSchema = z.object({
    productId: z.coerce.number().int().positive('Product ID must be a positive integer'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
    priceAtPurchase: z.coerce.number().positive('Price at purchase must be a positive number').optional(),
});

export const CreatingOrderSchema = z.object({
    userId: z.coerce.number().int().positive('User ID must be a positive integer'),
    shopId: z.coerce.number().int().positive('Shop ID must be a positive integer'),
    receiverName: z.string().min(1, 'Receiver name is required'),
    streetAddress: z.string().min(1, 'Shipping address is required'),
    city: z.string().min(1, 'City is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long'),
    email: z.string().email('Invalid email format'),
    totalAmount: z.coerce.number().min(0, 'Total amount must be a non-negative number'),
    shippingFee: z.coerce.number().min(0, 'Shipping fee must be a non-negative number'),
    finalAmount: z.coerce.number().min(0, 'Final amount must be a non-negative number'),
    items: z.array(ItemInCartSchema).min(1, 'At least one order item is required'),
    orderAt: z.string().datetime({ offset: true }).nonempty(),
    paymentMethodCode: z.enum(PAYMENT_METHOD, 'Invalid payment method')
});

export type CreatingOrderRequest = z.infer<typeof CreatingOrderSchema>;
export type OrderItemRequest = z.infer<typeof OrderItemSchema>;
export type ItemInCart = z.infer<typeof ItemInCartSchema>;

export const OrderSchema = {
    creating: CreatingOrderSchema,
    itemOrder: OrderItemSchema,
    itemInCart: ItemInCartSchema,
};