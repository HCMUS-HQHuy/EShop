import express from 'express';
import { Server, DefaultEventsMap } from 'socket.io';
import { UserInfor } from './index.types';

export enum USER_ROLE {
    ADMIN = 'Admin',
    SELLER = 'Seller',
    CUSTOMER = 'Customer',
    GUEST = 'Guest',
    USER = 'User'
};

export enum SORT_ATTRIBUTES {
    NAME = 'name',
    CREATED_AT = 'created_at',
};

export enum SORT_ORDERS {
    ASC = 'asc',
    DESC = 'desc',
}

export const ORDER_STATUSES = {
    PENDING: 'Pending',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
} as const;

export const SHOP_STATUS = {
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    PENDING_VERIFICATION: 'Pending Verification',
    CLOSED: 'Closed',
    BANNED: 'Banned'
} as const;

export const USER_STATUS = {
    ACTIVE: 'Active',
    BANNED: 'Banned',
} as const;

export type ShopStatus = typeof SHOP_STATUS[keyof typeof SHOP_STATUS];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export interface ValidationResult {
    valid: boolean;
    errors: Partial<Record<string, string>>;
}

export const regex = {
    phone: /^\+?[0-9]{10,15}$/
}

export enum SOCKET_NAMESPACE {
  USER = '/user',
  SELLER = '/seller',
  ADMIN = '/admin',
}

export enum PAYMENT_STATUS {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    REFUNDED = 'Refunded'
};

export enum PAYMENT_METHOD {
    MOMO = 'MOMO',
    COD = 'COD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    PAYPAL = 'PAYPAL'
};

export enum PRODUCT_STATUS {
    PENDING = 'PendingApproval',
    REJECTED = 'Rejected',
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    BANNED = 'Banned'
}

export interface RequestCustom extends express.Request {
    user?: UserInfor;
    io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}