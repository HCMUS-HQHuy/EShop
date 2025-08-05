import express from 'express';
import { UserStatus } from './account.types';

export const USER_ROLE = {
    ADMIN: 'Admin',
    SELLER: 'Seller',
    USER: 'User',
    GUEST: 'Guest'
} as const;
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export interface User {
    user_id: number;
    username: string;
    password: string;
    email: string;
    fullname: string;
    address?: string;
    phone_number?: string;
    role: UserRole;
    created_at: string;
    is_deleted: boolean;
    deleted_at?: string;
}

export interface UserInfor {
    user_id: number;
    username: string;
    role: UserRole;
    status: UserStatus;
    seller_profile_id?: string; // Optional, only for sellers
}

export interface RequestCustom extends express.Request {
    user?: UserInfor;
}