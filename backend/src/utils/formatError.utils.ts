import type { ZodError } from "zod";

export function formatError(error: ZodError<any>) {
    const formattedErrors: Record<string, string> = {};
    const fieldErrors = error.issues;
    fieldErrors.forEach(issue => {
        const path = issue.path.join('.');
        formattedErrors[path] = issue.message;
    });
    return formattedErrors;
}

export default formatError;