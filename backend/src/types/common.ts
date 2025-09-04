export enum USER_ROLE {
    ADMIN = 'Admin',
    SELLER = 'Seller',
    CUSTOMER = 'Customer',
    GUEST = 'Guest',
    USER = 'User'
};

export const SORT_ATTRIBUTES = ['name', 'created_at'] as const;

export const SORT_ORDERS = ['asc', 'desc'] as const;

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
export type SortAttribute = typeof SORT_ATTRIBUTES[number];
export type SortOrder = typeof SORT_ORDERS[number];
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