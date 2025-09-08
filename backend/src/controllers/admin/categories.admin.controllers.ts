import express from "express";

import { Client } from "pg";
import database from "src/database/index.database";
import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";

import { CategoryAddRequest, CategoryParamsRequest, CategoryUpdateRequest } from "src/types/category.types";
import { RequestCustom } from "src/types/common.types";

// #### VALIDATION FUNCTIONS ####

// #### HELPER FUNCTIONS ####

async function checkCategoryRecordNotExist(name: string) {
    try {
        const count = await countRecordHavingName(name);
        return count === 0;
    } catch (error: any) {
        throw error;
    }
}

async function checkCategoryRecordExist(name: string) {
    try {
        const count = await countRecordHavingName(name);
        return count > 0;
    } catch (error: any) {
        throw error;
    }
}

// #### DATABASE FUNCTIONS ####

async function countRecordHavingName(name: string) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const query = `
            SELECT * FROM categories 
            WHERE name = $1 AND is_deleted = false
        `;
        const result = await db.query(query, [name]);
        return result.rows.length;
    } catch (error: any) {
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function addCategory(name: string, description: string | undefined): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO categories (name, description) 
            VALUES ($1::text, $2::text)
        `;
        await db.query(sql, [name, description]);
    } catch (error: any) {
        console.error("Error adding category:", error);
        throw new Error("Error adding category: " + error.message);
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function getCategories(params: CategoryParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
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
        console.log("Executing SQL:", sql, "with params:", queryParams);
        const result = await db.query(sql, queryParams);
        return result.rows;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function updateCategory(name: string, categoryData: CategoryUpdateRequest): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
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
            await database.releaseConnection(db);
        }
    }
}

async function deleteCategory(name: string, userId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
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
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function add(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }

    const parsedBody = schemas.category.addRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: CategoryAddRequest = parsedBody.data;
    console.log("Listing products with params:", params);
    try {
        // they must be string, so no need to check for undefined
        if (await checkCategoryRecordExist(params.name)) {
            return res.status(400).json(util.response.error(
                "Validation error",
                {detail: `Category with name: "${params.name}" already exists`}
            ));
        }

        await addCategory(params.name, params.description);
        res.status(201).json(util.response.success("Category created successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
    console.log("Category added successfully");
}

async function get(req: RequestCustom, res: express.Response) {
    console.log("Fetching categories with query parameters:", req.query);
    const parsedBody = schemas.category.paramsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: CategoryParamsRequest = parsedBody.data;
    console.log("Listing categories with params:", params);
    try {
        const categories = await getCategories(params);
        res.status(200).json(util.response.success("successfull", {categories}));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

async function update(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }
    console.log("Updating category with params:", req.params, "and body:", req.body);
    const parsedParam = schemas.category.updateRequest.safeParse(req.params);
    if (!parsedParam.success) {
        return res.status(400).send(util.response.zodValidationError(parsedParam.error));
    }
    const parsedBody = schemas.category.updateRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const categoryName = parsedParam.data.name;
    const categoryData: CategoryUpdateRequest = parsedBody.data;

    try {
        if (await checkCategoryRecordNotExist(categoryName)) {
            return res.status(400).json(util.response.error(
                "Validation error",
                { details: `Category with name: "${categoryName}" does not exist`}
            ));
        }
        if (categoryName !== categoryData.name && await checkCategoryRecordExist(categoryData.name)) {
            return res.status(400).json(util.response.error(
                "Validation error",
                { details: `Category with name: "${categoryData.name}" already exists`}
            ));
        }
        console.log("Updating category:", categoryName, "with data:", categoryData);
    } catch (error: any) {
        console.error("Error updating category:", error);
        return res.status(500).json(util.response.internalServerError());
    }

    try {
        await updateCategory(categoryName, categoryData);
        res.status(200).json(util.response.success("Category updated successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

async function remove(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }
    const parsedParam = schemas.category.updateRequest.safeParse(req.params);
    if (!parsedParam.success) {
        return res.status(400).send(util.response.zodValidationError(parsedParam.error));
    }
    const categoryName = parsedParam.data.name;
    try {
        if (await checkCategoryRecordNotExist(categoryName)) {
            return res.status(400).json(util.response.error(
                "Validation error",
                { details: [`Category with name: "${categoryName}" does not exist`] }
            ));
        }
        await deleteCategory(categoryName, req.user?.user_id as number);
        res.status(200).json(util.response.success("Category deleted successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

const category = {
    add,
    get,
    update,
    remove
};

export default category;
