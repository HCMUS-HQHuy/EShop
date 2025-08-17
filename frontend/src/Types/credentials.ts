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

// Types
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

// Export schemas
export const authSchemas = {
  login: LoginSchema,
  register: RegisterSchema,
};

export default authSchemas;
