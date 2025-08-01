import { UserRegistration, ValidationResult } from "../types/validation";

export function validateRegistration(input: Partial<UserRegistration>): ValidationResult {
    const errors: Partial<Record<keyof UserRegistration, string>> = {};

    if (input.username !== undefined) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!input.username) {
            errors.username = "Username is required.";
        } else if (!usernameRegex.test(input.username)) {
            errors.username = "Username must be 3-20 characters and only contain letters, numbers, and underscores.";
        }
    }

    if (input.password !== undefined) {
        if (!input.password) {
            errors.password = "Password is required.";
        } else if (input.password.length < 8 || input.password.length > 50) {
            errors.password = "Password must be between 8 and 50 characters.";
        } else if (!/[a-z]/.test(input.password)) {
            errors.password = "Password must contain at least one lowercase letter.";
        } else if (!/[A-Z]/.test(input.password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(input.password)) {
            errors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(input.password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    if (input.confirmPassword !== undefined) {
        if (!input.confirmPassword) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (input.password && input.confirmPassword !== input.password) {
            errors.confirmPassword = "Passwords do not match.";
        }
    }

    if (input.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!input.email) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(input.email)) {
            errors.email = "Email format is invalid.";
        }
    }

    if (input.fullname !== undefined) {
        if (!input.fullname) {
            errors.fullname = "Full name is required.";
        } else if (input.fullname.length < 2 || input.fullname.length > 100) {
            errors.fullname = "Full name must be between 2 and 100 characters.";
        }
    }

    

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}
