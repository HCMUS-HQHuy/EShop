import { ZodError } from "zod";
import formatError from "./formatError.utils";

function successResponse(message: string, data: any[]) {
  return {
    message: message,
    error: false,
    data: data || [],
  };
}

function errorResponse(message: string, data: any[]) {
  return {
    message: message,
    error: true,
    data: data || []
  };
}

function authorErrorResponse(role: string) {
  return {
    message: 'Invalid Request',
    error: true,
    data: [`Only ${role} can review seller accounts.`]
  };
}

function zodValidationErrorResponse(errors: ZodError) {
  return {
    message: 'Validation Error',
    error: true,
    data: [formatError(errors)],
  };
}

const response = {
  success: successResponse,
  error: errorResponse,
  authorError: authorErrorResponse,
  zodValidationError: zodValidationErrorResponse
};
export default response;