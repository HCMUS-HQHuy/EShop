import express from "express";

import { Client } from "pg";
import database from "database/index.database";

import * as types from "types/index.types";

// #### DATABASE FUNCTIONS ####

async function getCategories(params: types.CategoryParamsRequest): Promise<types.CategoryInformation[]> {
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
                WHERE title ILIKE $1
                    AND is_deleted = FALSE
                ORDER BY ${params.sortAttribute} ${params.sortOrder}
                LIMIT $2 OFFSET $3
            `;
        const limit         = Number(process.env.PAGINATION_LIMIT);
        const offset        = (params.page - 1) * limit;

        const queryParams = [`%${params.keywords}%`, limit, offset];
        const result = await db.query(sql, queryParams);
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
    console.log("Fetching categories with query parameters:", req.query);
    const parsedBody = types.categorySchemas.paramsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send({ error: 'Invalid request data', details: parsedBody.error.format() });
    }
    const params: types.CategoryParamsRequest = parsedBody.data;
    console.log("Listing categories with params:", params);
    try {
        const categories = await getCategories(params);
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}

const category = {
    get
};

export default category;
