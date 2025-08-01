import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";

import * as types from "../types/index.types";

export async function addCategory(categoryData: types.CategoryUpdate): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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