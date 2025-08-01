import * as types from "../types/index.types";

export function validateCategoryInput(input: Partial<types.CategoryUpdate>): types.ValidationCategoryResult {
    const errors: Partial<Record<keyof types.CategoryUpdate, string>> = {};
    if (!input.name || input.name.trim() === "") {
        errors.name = "Name is required";
    } else if (input.name.length < 3) {
        errors.name = "Name must be at least 3 characters long";
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}
