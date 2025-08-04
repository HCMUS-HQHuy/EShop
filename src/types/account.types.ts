export type seller_status = 'Active' | 'Rejected' | 'PendingVerification' | 'Closed';
export type user_status = 'Active' | 'Banned';

export interface AdminVerifySellerRequest {
    seller_id: number;
    status: seller_status;
    rejection_reason?: string;
}

export interface BlockUnblockUserRequest {
    user_id: number;
    status: user_status;
}

export interface ValidationUpdatingAccountResult {
    valid: boolean;
    errors: Partial<Record<keyof AdminVerifySellerRequest |  keyof BlockUnblockUserRequest, string>>;
}