import { z } from 'zod';
import * as types from './index.types';

export interface AdminVerifySellerRequest {
  seller_id: number;
  status: types.SellerStatus;
  rejection_reason?: string;
}

export interface BlockUnblockUserRequest {
  user_id: number;
  status: types.UserStatus;
}

const ShopInformationSchema = z.object({
    user_id: z.number().int().positive('User ID must be a positive integer'),
    shop_name: z.string().min(1, 'Shop name is required'),
    shop_description: z.string().optional(),
    status: z.enum(types.SHOP_STATUS).optional(),
    admin_note: z.string().optional(),
    created_at: z.string().datetime('Created at must be a valid date').optional(),
});

const CreationRequestSchema = z.object({
    shop_name: z.string().min(1, 'Shop name is required'),
    shop_description: z.string().max(500, 'Shop description must not exceed 500 characters').optional(),
});

export type ShopInformation = z.infer<typeof ShopInformationSchema>;
export type ShopCreationRequest = z.infer<typeof CreationRequestSchema>;
export const shopSchemas = {
    Information: ShopInformationSchema,
    CreationRequest: CreationRequestSchema
};