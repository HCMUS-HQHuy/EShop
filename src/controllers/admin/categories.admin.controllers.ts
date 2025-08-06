import express from "express";

import { Client } from "pg";
import { getConnection, releaseConnection } from "../../config/db";

import * as types from "../../types/index.types";
import * as util from "../../utils/index.utils";

// #### VALIDATION FUNCTIONS ####

function validateCategoryInput(input: Partial<types.CategoryUpdate>): types.ValidationResult {
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

// #### DATABASE FUNCTIONS ####

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

async function addCategory(categoryData: types.CategoryUpdate): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        await checkCategoryRecord(db, categoryData.name as string, false);

        const sql = `
            INSERT INTO categories (name, description) 
            VALUES ($1, $2)
        `;
        await db.query(sql, [categoryData.name, categoryData.description]);
    } catch (error: any) {
        console.error("Error adding category:", error);
        throw new Error("Error adding category: " + error.message);
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

async function getCategories(params: types.CategoryParamsRequest): Promise<types.Category[]> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
                SELECT * FROM categories
                WHERE name ILIKE $1
                    AND ($4::date IS NULL OR created_at >= $4::date)
                    AND ($5::date IS NULL OR created_at <= $5::date)
                    AND ($6::date IS NULL OR deleted_at >= $6::date)
                    AND ($7::date IS NULL OR deleted_at <= $7::date)
                    AND ($8::boolean IS NULL OR is_deleted = $8::boolean)
                ORDER BY ${params.sortAttribute} ${params.sortOrder}
                LIMIT $2 OFFSET $3
            `;
        const limit         = Number(process.env.PAGINATION_LIMIT);
        const offset        = (params.page - 1) * limit;
        const createdFrom   = params?.filter?.created_from;
        const createdTo     = params?.filter?.created_to;
        const deleted_from  = params?.filter?.deleted_from;
        const deletedTo     = params?.filter?.deleted_to;
        const isDeleted     = params?.filter?.is_deleted;

        const queryParams = [`%${params.keywords}%`, limit, offset, createdFrom, createdTo, deleted_from, deletedTo, isDeleted];
        const result = await db.query(sql, queryParams);
        return result.rows as types.Category[];
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

async function updateCategory(name: string, categoryData: types.CategoryUpdate): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        if (!categoryData.name) {
            categoryData.name = name;
        }
        const sql = `
            UPDATE categories
            SET name = $1, description = $2 
            WHERE name = $3
        `;
        await db.query(sql, [categoryData.name, categoryData.description, name]);
    } catch (error: any) {
        console.error("Error updating category:", error);
        throw error;
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

async function deleteCategory(name: string, userId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            UPDATE categories
            SET is_deleted = true, deleted_at = NOW(), deleted_by = $2
            WHERE name = $1
        `;
        await db.query(sql, [name, userId]);
    } catch (error: any) {
        console.error("Error deleting category:", error);
        throw error;
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function add(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can add categories." });
    }

    const categoryData: types.CategoryUpdate = req.body;
    const validationError = validateCategoryInput(categoryData);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }
    try {
        await addCategory(categoryData);
        res.status(201).json({
            message: "Category created successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error creating category",
            errors: error.message
        });
    }
    console.log("Category added successfully");
}

async function get(req: express.Request, res: express.Response) {
    try {
        console.log("Fetching categories with query parameters:", req.query);

        const params: types.CategoryParamsRequest = {
            page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
            sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
            sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
            keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
            filter: {
                created_from: req.query.created_from !== undefined ? String(req.query.created_from) : undefined,
                created_to: req.query.created_to !== undefined ? String(req.query.created_to) : undefined,
                deleted_from: req.query.deleted_from !== undefined ? String(req.query.deleted_from) : undefined,
                deleted_to: req.query.deleted_to !== undefined ? String(req.query.deleted_to) : undefined,
                is_deleted: req.query.is_deleted !== undefined ? Boolean(req.query.is_deleted === "true") : undefined
            }
        };

        const validationError = util.validateCategoryFilters(params);

        if (!validationError.valid) {
            return res.status(400).json({
                message: "Validation error",
                errors: validationError.errors
            });
        }

        console.log("Fetching categories with params:", params);

        const categories = await getCategories(params);
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}

async function update(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can update categories." });
    }    
    const categoryName = req.params.name;
    const categoryData: types.CategoryUpdate = req.body;

    if (!categoryName) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const validationError = await util.validateUpdateCategoryInput(categoryName, categoryData);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation update category input error",
            errors: validationError.errors
        });
    }

    try {
        await updateCategory(categoryName, categoryData);
        res.status(200).json({
            message: "Category updated successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error updating category",
            errors: error.message
        });
    }
}

async function remove(req: types.RequestCustom, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can delete categories." });
    }
    const categoryName = req.params.name;
    
    if (!categoryName) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const validationError = await util.validateUpdateCategoryInput(categoryName);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation delete category input error",
            errors: validationError.errors
        });
    }

    try {
        await deleteCategory(categoryName, req.user?.user_id as number);
        res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error deleting category",
            errors: error.message
        });
    }
}

const category = {
    add,
    get,
    update,
    remove
};

export default category;
