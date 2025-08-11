import { z } from 'zod';
import * as types from 'types/index.types';

const AdminVerifySellerRequestSchema = z.object({
	shop_id: z.coerce.number().int().positive('Seller ID must be a positive integer'),
	status: z.enum([types.SHOP_STATUS.REJECTED, types.SHOP_STATUS.ACTIVE], 'Invalid seller status'),
	admin_note: z.string().max(500, 'Rejection reason must not exceed 500 characters').optional(),
});

const BlockUnblockUserRequestSchema = z.object({
	user_id: z.coerce.number().int().positive('User ID must be a positive integer'),
	status: z.enum([types.USER_STATUS.BANNED, types.USER_STATUS.ACTIVE], 'Invalid user status'),
});

const ShopInformationSchema = z.object({
    user_id: z.coerce.number().int().positive('User ID must be a positive integer'),
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
export type AdminVerifySellerRequest = z.infer<typeof AdminVerifySellerRequestSchema>;
export type BlockUnblockUserRequest = z.infer<typeof BlockUnblockUserRequestSchema>;

export const shopSchemas = {
    Information: ShopInformationSchema,
    CreationRequest: CreationRequestSchema,
	AdminVerify: AdminVerifySellerRequestSchema,
	BlockUnblock: BlockUnblockUserRequestSchema,
};