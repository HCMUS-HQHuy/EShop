import { z } from 'zod';
import { PAYMENT_METHOD } from '@prisma/client';

const OrderItemSchema = z.object({
    productId: z.coerce.number().int().positive('Product ID must be a positive integer'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
    price: z.coerce.number().positive('Price at purchase must be a positive number').default(0),
    discount: z.coerce.number().positive('Discount at purchase must be a positive number').default(0),
});

const CreatingOrderSchema = z.object({
    shopId: z.coerce.number().int().positive('Shop ID must be a positive integer'),
    receiverName: z.string().min(1, 'Receiver name is required'),
    shippingAddress: z.string().min(1, 'Shipping address is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long'),
    email: z.string().email('Invalid email format'),
    items: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
    orderAt: z.string().datetime({ offset: true }).nonempty(),
    paymentMethodCode: z.enum(PAYMENT_METHOD, 'Invalid payment method')
});

const order = {
    item: OrderItemSchema,
    creating: CreatingOrderSchema
}

export default order;