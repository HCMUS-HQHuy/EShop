export const SHOP_STATUS = {
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    PENDING_VERIFICATION: 'Pending Verification',
    CLOSED: 'Closed',
    BANNED: 'Banned'
} as const;

export type ShopStatus = typeof SHOP_STATUS[keyof typeof SHOP_STATUS];

export enum STORAGE_KEYS {
  CART_PRODUCTS = "cartProducts",
  WISH_LIST = "wishList",
};

export enum SOCKET_NAMESPACE {
  USER = '/user',
  SELLER = '/seller',
  ADMIN = '/admin',
}

export enum ORDER_STATUS {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPING = 'Shipping',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}