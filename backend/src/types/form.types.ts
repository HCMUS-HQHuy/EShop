import { z } from "zod";
import schemas from "src/schemas/index.schema";

// Type definitions
export type LoginForm = z.infer<typeof schemas.form.login>;
export type RegisterForm = z.infer<typeof schemas.form.register>;