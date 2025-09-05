import { z } from 'zod';
import { SHOP_STATUS, USER_ROLE, USER_STATUS } from 'types/index.types';

const BlockUnblockUserRequestSchema = z.object({
    user_id: z.coerce.number().int().positive('User ID must be a positive integer'),
    status: z.enum([USER_STATUS.BANNED, USER_STATUS.ACTIVE], 'Invalid user status'),
});

const UserInforSchema = z.object({
  user_id: z.coerce.number().int("User ID must be an integer").positive("User ID must be greater than 0"),
  username: z.string().min(1, "Username must not be empty"),
  role: z.enum(USER_ROLE, {error: "Invalid role: must be a valid UserRole",}),
  shop_id: z.coerce.number().int("Shop ID must be an integer").positive("Shop ID must be greater than 0").optional(),
  shop_status: z.enum(SHOP_STATUS, {error: "Invalid status: must be a valid ShopStatus",}).optional(),
});

const user = {
    infor: UserInforSchema,
    updateStatus: BlockUnblockUserRequestSchema,
}

export default user;