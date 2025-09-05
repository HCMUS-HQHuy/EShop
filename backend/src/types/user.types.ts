import express from 'express';
import { Server, DefaultEventsMap } from 'socket.io';
import z from 'zod'

import { USER_ROLE, SHOP_STATUS } from "types/index.types"

const UserInforSchema = z.object({
  user_id: z.coerce.number().int("User ID must be an integer").positive("User ID must be greater than 0"),
  username: z.string().min(1, "Username must not be empty"),
  role: z.enum(USER_ROLE, {error: "Invalid role: must be a valid UserRole",}),
  shop_id: z.coerce.number().int("Shop ID must be an integer").positive("Shop ID must be greater than 0").optional(),
  shop_status: z.enum(SHOP_STATUS, {error: "Invalid status: must be a valid ShopStatus",}).optional(),
});

export type UserInfor = z.infer<typeof UserInforSchema>;

export interface RequestCustom extends express.Request {
    user?: UserInfor;
    io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

export const userSchemas = {
    infor: UserInforSchema
}