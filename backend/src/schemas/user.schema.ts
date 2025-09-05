import { z } from 'zod';
import { SHOP_STATUS, USER_STATUS } from 'types/index.types';

const BlockUnblockUserRequestSchema = z.object({
    user_id: z.coerce.number().int().positive('User ID must be a positive integer'),
    status: z.enum([USER_STATUS.BANNED, USER_STATUS.ACTIVE], 'Invalid user status'),
});


const user = {
    updateStatus: BlockUnblockUserRequestSchema,
}

export default user;