export interface SellerProfile {
    seller_profile_id: number;
    user_id: number;
    shop_name: string;
    shop_description?: string;
    status?: 'PendingVerification' | 'Active' | 'Rejected' | 'Closed';
    rejection_reason?: string;
    created_at: string;
    updated_at?: string;
}

export interface SellerAccountCreationRequest {
    user_id: number;
    shop_name: string;
    shop_description?: string;
}

export interface ValidationSellerAccountResult {
  valid: boolean;
  errors: Partial<Record<keyof SellerAccountCreationRequest, string>>;
}