import type { ZodError } from "zod";

export function formatError(error: ZodError<any>) {
    const formattedErrors: Record<string, string> = {};
    const fieldErrors = error.format();

    for (const key in fieldErrors) {
      if (key !== "_errors" && fieldErrors[key]?._errors?.length > 0) {
        formattedErrors[key] = fieldErrors[key]._errors[0];
      }
    }
    return formattedErrors;
}

export default formatError;