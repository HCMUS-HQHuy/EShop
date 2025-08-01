import * as types from "../types/index.types";
import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";

async function checkCategoryRecord(db: Client, name: string, shouldBeExists: boolean) {
    const query = `
        SELECT * FROM categories 
        WHERE name = $1 AND is_deleted = false
    `;
    try {
        if (await db.query(query, [name]).then(result => result.rows.length > 0) != shouldBeExists) {
            throw new Error(shouldBeExists 
                ? "Category with this name does not exist" 
                : "Category with this name already exists"
            );
        }
    } catch (error: any) {
        throw error;
    }
}

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

export function validateCategoryFilters(params: types.CategoryParamsRequest): types.ValidationCategoryResult {
    const errors: Partial<Record<keyof types.CategoryParamsRequest, any>> = {};
    
    if (params.keywords.trim() === "") {
        errors.keywords = "Keywords must not be empty";
    }
    if (params.page < 1) {
        errors.page = "Page must be greater than 0";
    }
    if (!["name", "created_at"].includes(params.sortAttribute)) {
        errors.sortAttribute = "Invalid sort attribute";
    }
    if (!["asc", "desc"].includes(params.sortOrder)) {
        errors.sortOrder = "Invalid sort order";
    }
    if (params.filter) {
        if (params.filter.created_from && isNaN(Date.parse(params.filter.created_from))) {
            errors.filter.created_from = "Invalid date format for created_from";
        }
        if (params.filter.created_to && isNaN(Date.parse(params.filter.created_to))) {
            errors.filter.created_to = "Invalid date format for created_to";
        }
        if (params.filter.deleted_from && isNaN(Date.parse(params.filter.deleted_from))) {
            errors.filter.deleted_from = "Invalid date format for deleted_from";
        }
        if (params.filter.deleted_to && isNaN(Date.parse(params.filter.deleted_to))) {
            errors.filter.deleted_to = "Invalid date format for deleted_to";
        }
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

export async function validateUpdateCategoryInput(currentName: string, input: Partial<types.CategoryUpdate> | undefined = undefined): Promise<types.ValidationCategoryResult> {
    const errors: Partial<Record<keyof types.CategoryUpdate, string>> = {};
    if (input?.name && input.name.trim() === "") {
        errors.name = "Name must not be empty";
    } else if (input?.name && input.name.length < 3) {
        errors.name = "Name must be at least 3 characters long";
    }
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        await checkCategoryRecord(db, currentName as string, true);
        if (input?.name && input.name.trim() !== "" && input.name !== currentName) {
            await checkCategoryRecord(db, input.name as string, false);
        }
    } catch (error: any) {
        errors.name = error.message;
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}
