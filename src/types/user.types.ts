export type UserRole = 'Admin' | 'Seller' | 'Buyer';

export interface User {
  user_id: number;
  username: string;
  password: string;
  email: string;
  fullname: string;
  address?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
  is_deleted: boolean;
  deleted_at?: string;
}
