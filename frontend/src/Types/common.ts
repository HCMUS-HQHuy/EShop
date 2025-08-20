export const SHOP_STATUS = {
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    PENDING_VERIFICATION: 'Pending Verification',
    CLOSED: 'Closed',
    BANNED: 'Banned'
} as const;

export type ShopStatus = typeof SHOP_STATUS[keyof typeof SHOP_STATUS];