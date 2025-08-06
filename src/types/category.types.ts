export interface Category {
  name: string;
  description?: string;
  created_at: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
}

export interface CategoryFilter {
  created_from?: string;
  created_to?: string;
  deleted_from?: string;
  deleted_to?: string;
  is_deleted?: boolean;
}

export interface CategoryParamsRequest {
  keywords: string;
  page: number;
  sortAttribute: string;
  sortOrder: string;
  
  filter?: CategoryFilter;
}