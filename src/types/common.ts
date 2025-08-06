
export const SORT_ATTRIBUTES = ['name', 'created_at'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortAttribute = typeof SORT_ATTRIBUTES[number];
export type SortOrder = typeof SORT_ORDERS[number];


export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<string, string>>;
}
