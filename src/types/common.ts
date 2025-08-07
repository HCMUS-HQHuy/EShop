
export const SORT_ATTRIBUTES = ['name', 'created_at'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortAttribute = typeof SORT_ATTRIBUTES[number];
export type SortOrder = typeof SORT_ORDERS[number];

export const SHOP_STATUS = {
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    PENDING_VERIFICATION: 'PendingVerification',
    CLOSED: 'Closed',
    BANNED: 'Banned'
} as const;

export const USER_STATUS = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
} as const;

export type SellerStatus = typeof SHOP_STATUS[keyof typeof SHOP_STATUS];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<string, string>>;
}
