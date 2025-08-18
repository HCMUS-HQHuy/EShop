import express from "express";

import { Client } from "pg";
import database from "database/index.database";

import * as types from "types/index.types";

// #### DATABASE FUNCTIONS ####

async function getCategories(isTopLevel: boolean): Promise<types.CategoryInformation[]> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
                SELECT 
                    category_id AS "categoryId",
                    iconName AS "iconName",
                    title AS "title",
                    description AS "description",
                    parent_id AS "parentId"
                FROM categories
                WHERE is_deleted = FALSE
                    ${isTopLevel ? "AND parent_id IS NULL" : ""}
                ORDER BY title
            `;
        const result = await db.query(sql);
        return result.rows as types.CategoryInformation[];
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function get(req: express.Request, res: express.Response) {
    try {
        const categories = await getCategories(false);
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}

async function getTopLevel(req: express.Request, res: express.Response) {
    try {
        const categories = await getCategories(true);
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}

const category = {
    get,
    getTopLevel
};

export default category;
