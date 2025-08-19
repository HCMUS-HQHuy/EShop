import { z } from "zod";

// Password schema (you can toggle rules here)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(50, "Password must not exceed 50 characters.");

// Login schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: passwordSchema,
});

export const LoginInforSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email("Invalid email address."),
  address: z.string().min(10).max(100),
  phoneNumber: z.string().min(10).max(15),
  isSignIn: z.boolean(),
});

// Types
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type LoginInforValues = z.infer<typeof LoginInforSchema>;

// Export schemas
export const authSchemas = {
  login: LoginSchema,
  loginInfo: LoginInforSchema,
};

export default authSchemas;
