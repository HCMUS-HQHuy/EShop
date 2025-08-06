export const PRODUCT_STATUS = {
    PENDING: 'PendingApproval',
    REJECTED: 'Rejected',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    BANNED: 'Banned'
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

export interface Product {
    product_id: number;
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    category_id: number;
    seller_id: number;
    created_at: string;
    is_deleted: boolean;
    deleted_at?: string;
}

export interface ProductImage {
    image_id: number;
    product_id: number;
    image_url: string;
    created_at: string;
}

export interface ProductReview {
    review_id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface ProductAddRequest {
    name?: string;
    description?: string;
    price?: number;
    stock_quantity?: number;
    image_url?: string;
    category_id?: number;
    shop_id?: number;
};

interface BaseProductFilter {
    category_id?: number;
    minPrice?: number;
    maxPrice?: number;
}

export interface AdminProductFilter extends BaseProductFilter {
    isDeleted?: boolean; // Only admins can see deleted products
    sellerId?: string;   // Admin can filter by any seller
    status?: ProductStatus;
}

export interface SellerProductFilter extends BaseProductFilter {
    isDeleted?: never;   // Not allowed
    sellerId?: never;    // Not allowed — implicitly always the current seller
    status?: ProductStatus; // Seller can filter by their own products' status
}

export interface UserProductFilter extends BaseProductFilter {
    isDeleted?: never;
    sellerId?: never;
    status?: never;
}

export interface ProductParamsRequest {
    keywords: string;
    page: number;
    sortAttribute: string;
    sortOrder: string;
    filter?: AdminProductFilter | SellerProductFilter | UserProductFilter;
}
