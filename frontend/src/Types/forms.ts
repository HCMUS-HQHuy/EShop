import { z } from "zod";

// Password schema (you can toggle rules here)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(50, "Password must not exceed 50 characters.");
  // Add refine rules here if needed

// Login schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: passwordSchema,
});

export const ResetPasswordSchema = z.object({
  password: passwordSchema,
  confirmedPassword: passwordSchema,
}).refine((data) => data.password === data.confirmedPassword, {
  message: "Passwords must match.",
  path: ["confirmedPassword"],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address."),
});

// Register schema
export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const LoginInforSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email("Invalid email address."),
  address: z.string().min(10).max(100),
  phoneNumber: z.string().min(10).max(15),
  isSignIn: z.boolean(),
});

export const SellerRegistrationFormSchema = z.object({
  shopName: z.string().min(2).max(100),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10).max(15),
  shopDescription: z.string().min(10).max(500),
  address: z.string().min(10).max(100),
  agreeTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions.",
  }),
});

// Types
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type SellerRegistrationFormValues = z.infer<typeof SellerRegistrationFormSchema>;
export type LoginInforValues = z.infer<typeof LoginInforSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type FormState = { signUp: RegisterFormValues; login: LoginFormValues; sellerRegistrationForm: SellerRegistrationFormValues; resetPassword: ResetPasswordFormValues; forgotPassword: ForgotPasswordFormValues };
export type FormKeys = keyof FormState;

// Export schemas
export const formSchemas = {
  login: LoginSchema,
  register: RegisterSchema,
  loginInfo: LoginInforSchema,
  sellerRegistration: SellerRegistrationFormSchema,
  resetPassword: ResetPasswordSchema,
  forgotPassword: ForgotPasswordSchema,
};

export default formSchemas;
