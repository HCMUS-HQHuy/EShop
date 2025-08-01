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

export async function getCategories(): Promise<types.Category[]> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = "SELECT * FROM categories";
        const result = await db.query(sql);
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