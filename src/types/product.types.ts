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
