import { ZodError } from 'zod';

/**
 * Parses ZodError into a readable array of error messages.
 */
function parseZodError(errors: ZodError): string[] {
    return errors.issues.map((err) => {
        const path = err.path.join('.') || 'Field';
        return `${path}: ${err.message}`;
    });
}

export default parseZodError;