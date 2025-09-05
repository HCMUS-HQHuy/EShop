import { z } from "zod";

// Password validation regexes
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(50, "Password must not exceed 50 characters.")
  // .refine((val) => /[a-z]/.test(val), {
  //   message: "Password must contain at least one lowercase letter.",
  // })
  // .refine((val) => /[A-Z]/.test(val), {
  //   message: "Password must contain at least one uppercase letter.",
  // })
  // .refine((val) => /[0-9]/.test(val), {
  //   message: "Password must contain at least one number.",
  // })
  // .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
  //   message: "Password must contain at least one special character.",
  // });
// I think this is a good approach to keep the password validation flexible and easily adjustable.

// Credentials schema
export const UserCredentialsSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: passwordSchema,
});

// Registration schema
export const UserRegistrationSchema = UserCredentialsSchema.extend({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain letters, numbers, and underscores.",
    }),
});

const form = {
    login: UserCredentialsSchema,
    register: UserRegistrationSchema,
}
export default form;