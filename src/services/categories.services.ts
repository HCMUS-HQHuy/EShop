import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";

import * as types from "../types/index.types";

export async function addCategory(categoryData: types.CategoryUpdate): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        
        const existingCategoryQuery = "SELECT * FROM categories WHERE name = $1 and is_deleted = false";
        const existingCategoryResult = await db.query(existingCategoryQuery, [categoryData.name]);

        if (existingCategoryResult.rows.length > 0) {
            throw new Error("Category with this name already exists");
        }

        const sql = "INSERT INTO categories (name, description) VALUES ($1, $2)";
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

export async function getCategories(params: types.CategoryParamsRequest): Promise<types.Category[]> {
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
        const limit = Number(process.env.PAGINATION_LIMIT);
        const offset = (params.page - 1) * limit;
        const createdFrom = params?.filter?.created_from;
        const createdTo = params?.filter?.created_to;
        const deleted_from = params?.filter?.deleted_from;
        const deletedTo = params?.filter?.deleted_to;
        const isDeleted = params?.filter?.is_deleted;

        const queryParams = [`%${params.keywords}%`, limit, offset, createdFrom, createdTo, deleted_from, deletedTo, isDeleted];

        const result = await db.query(sql, queryParams);
        return result.rows as types.Category[];
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories: " + error.message);
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}