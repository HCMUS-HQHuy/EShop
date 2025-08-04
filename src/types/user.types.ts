import express from 'express';
export type UserRole = 'Admin' | 'User';

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
    shop_name?: string; // Optional, only for sellers
}

export interface RequestCustom extends express.Request {
    user?: UserInfor;
}