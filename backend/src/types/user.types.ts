import express from 'express';
import { Server, DefaultEventsMap } from 'socket.io';
import z from 'zod'

import * as types from "types/index.types"

// export interface User {
//     user_id: number;
//     username: string;
//     password: string;
//     email: string;
//     fullname: string;
//     address?: string;
//     phone_number?: string;
//     role: types.UserRole;
//     created_at: string;
//     is_deleted: boolean;
//     deleted_at?: string;
// }

const UserInforSchema = z.object({
  user_id: z.coerce.number().int("User ID must be an integer").positive("User ID must be greater than 0"),
  username: z.string().min(1, "Username must not be empty"),
  role: z.enum(types.USER_ROLE, {error: "Invalid role: must be a valid UserRole",}),
  shop_id: z.coerce.number().int("Shop ID must be an integer").positive("Shop ID must be greater than 0").optional(),
  shop_status: z.enum(types.SHOP_STATUS, {error: "Invalid status: must be a valid ShopStatus",}).optional(),
});

export type UserInfor = z.infer<typeof UserInforSchema>;

export interface RequestCustom extends express.Request {
    user?: UserInfor;
    io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

export const userSchemas = {
    infor: UserInforSchema
}