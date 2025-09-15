import { z } from 'zod';
import schemas from 'src/schemas/index.schema';

type OrderItemType = {
    productId: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
    subtotal: number;
};
type OrderType = {
    orderId: number;
    shopId: number;
    totalAmount: number;
    shippingFee: number;
    tax: number;
    discount: number;
    orderDate: Date;
    status: string;
    customerInfo: {
        name: string;
        address: string;
        phone: string;
    };
    products: OrderItemType[];
};

type CreatingOrderRequest = z.infer<typeof schemas.order.creating>;
type OrderItemRequest = z.infer<typeof schemas.order.item>;

export type { OrderType, OrderItemType, CreatingOrderRequest, OrderItemRequest };