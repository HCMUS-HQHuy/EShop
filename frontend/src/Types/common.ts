export enum SHOP_STATUS {
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  CLOSED = 'CLOSED',
  BANNED = 'BANNED'
}

export enum ALERT_STATE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

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
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PAYMENT_METHOD {
  COD = 'COD',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE'
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER'
}

export enum PRODUCT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  OUT_OF_STOCK = 'OUT OF STOCK',
}