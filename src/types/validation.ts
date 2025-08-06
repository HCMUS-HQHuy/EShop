export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullname: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<string, string>>;
}
