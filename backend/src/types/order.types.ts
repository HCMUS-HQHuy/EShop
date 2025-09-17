import { z } from 'zod';
import schemas from 'src/schemas/index.schema';

type CreatingOrderRequest = z.infer<typeof schemas.order.creating>;
type OrderItemRequest = z.infer<typeof schemas.order.item>;

export type { CreatingOrderRequest, OrderItemRequest };