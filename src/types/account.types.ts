export const USER_STATUS = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
} as const;

export const SELLER_STATUS = {
  ACTIVE: 'Active',
  REJECTED: 'Rejected',
  PENDING_VERIFICATION: 'PendingVerification',
  CLOSED: 'Closed',
  BANNED: 'Banned',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export type SellerStatus = typeof SELLER_STATUS[keyof typeof SELLER_STATUS];

export interface AdminVerifySellerRequest {
    seller_id: number;
    status: SellerStatus;
    rejection_reason?: string;
}

export interface BlockUnblockUserRequest {
    user_id: number;
    status: UserStatus;
}

export interface ValidationUpdatingAccountResult {
    valid: boolean;
    errors: Partial<Record<keyof AdminVerifySellerRequest |  keyof BlockUnblockUserRequest, string>>;
}