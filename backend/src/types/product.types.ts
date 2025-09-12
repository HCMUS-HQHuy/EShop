import { z } from 'zod';
import schemas from 'src/schemas/index.schema';

export type UserProductFilter   = z.infer<typeof schemas.product.userFilter>;
export type SellerProductFilter = z.infer<typeof schemas.product.sellerFilter>;
export type AdminProductFilter  = z.infer<typeof schemas.product.adminFilter>;
export type ProductInformation  = z.infer<typeof schemas.product.information>;
export type ProductParamsRequest= z.infer<typeof schemas.product.paramsRequest>;
export type UserProductParamsRequest = z.infer<typeof schemas.product.userParams>;
