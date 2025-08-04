export interface AdminVerifySellerRequest {
    seller_id: number;
    status: 'Active' | 'Rejected';
    rejection_reason?: string;
}

export interface BlockUnblockUserRequest {
    user_id: number;
    status: 'Active' | 'Banned';
}

export interface ValidationUpdatingAccountResult {
    valid: boolean;
    errors: Partial<Record<keyof AdminVerifySellerRequest |  keyof BlockUnblockUserRequest, string>>;
}