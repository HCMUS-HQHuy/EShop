export interface UserCredentials {
  username: string;
  password: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof UserCredentials, string>>;
}
