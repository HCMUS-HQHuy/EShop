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

export interface ProductFilterParams {
  created_from?: string;
  created_to?: string;
  status?: ProductStatus;
}

export interface ProductParamsRequest {
  keywords: string;
  page: number;
  sortAttribute: string;
  sortOrder: string;
  
  filter?: ProductFilterParams;
}


export interface ValidationProductResult {
  valid: boolean;
  errors: Partial<Record<keyof ProductParamsRequest | keyof ProductFilterParams | keyof ProductAddRequest | keyof Product, string>>;
}
