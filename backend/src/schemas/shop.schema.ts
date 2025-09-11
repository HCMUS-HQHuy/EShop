import { z } from 'zod';
import { SHOP_STATUS } from '@prisma/client';
import { regex } from 'src/types/index.types';


const ShopInformationSchema = z.object({
    userId: z.coerce.number().int().positive('User ID must be a positive integer'),
    shopName: z.string().min(1, 'Shop name is required'),
    shopDescription: z.string().optional(),
    status: z.enum(SHOP_STATUS).optional(),
    adminNote: z.string().optional(),
    createdAt: z.string().datetime('Created at must be a valid date').optional(),
});

const CreationRequestSchema = z.object({
    shopName: z.string().min(3, 'Shop name is required'),
    email: z.string().email('Invalid email address').max(100, 'Email must not exceed 100 characters'),
    phoneNumber: z.string().regex(regex.phone, 'Phone number must be 10-15 digits and may start with +'),
    address: z.string().max(255, 'Address must not exceed 255 characters'),
    shopDescription: z.string().max(1000, 'Shop description must not exceed 1000 characters'),
});

const AdminVerifySellerRequestSchema = z.object({
    userId: z.coerce.number().int().positive('User ID must be a positive integer'),
    shopId: z.coerce.number().int().positive('Seller ID must be a positive integer'),
    status: z.enum([SHOP_STATUS.REJECTED, SHOP_STATUS.ACTIVE, SHOP_STATUS.BANNED], 'Invalid seller status'),
    adminNote: z.string().max(500, 'Rejection reason must not exceed 500 characters').optional(),
});

const shop = {
    information: ShopInformationSchema,
    creationRequest: CreationRequestSchema,
    updateStatus: AdminVerifySellerRequestSchema
}

export default shop;