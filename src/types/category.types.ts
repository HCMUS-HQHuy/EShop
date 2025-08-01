export interface Category {
  name: string;
  description?: string;
  created_at: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
}

export interface ValidationCategoryResult {
  valid: boolean;
  errors: Partial<Record<keyof Category | keyof CategoryUpdate, string>>;
}

export interface CategoryParamsRequest {
  keywords: string;
  page: number;
  sortAttribute: string;
  sortOrder: string;
}