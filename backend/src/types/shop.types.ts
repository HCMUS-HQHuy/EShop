import { z } from 'zod';
import schemas from 'schemas/index.schema';


export type UpdateSellerStatusRequest = z.infer<typeof schemas.shop.updateStatus>;
export type ShopInformation = z.infer<typeof schemas.shop.information>;
export type ShopCreationRequest = z.infer<typeof schemas.shop.creationRequest>;