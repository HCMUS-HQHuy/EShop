import express from "express";

import { Client } from "pg";
import database from "database/index.database";
import { CategoryInfor } from "types/category.types";

// #### DATABASE FUNCTIONS ####

async function getCategories(db: Client, parent_id: number|null): Promise<CategoryInfor[]> {
    try {
        const sql = `
                SELECT 
                    category_id AS "categoryId",
                    iconName AS "iconName",
                    title AS "title",
                    description AS "description",
                    parent_id AS "parentId"
                FROM categories
                WHERE is_deleted = FALSE
                    ${parent_id === null ? "AND parent_id IS NULL" : `AND parent_id = ${parent_id}`}
                ORDER BY title
            `;
        const result = await db.query(sql);
        if (result.rowCount === 0) {
            return [];
        }
        const categories: CategoryInfor[] = Array<CategoryInfor>();
        for (const row of result.rows) {
            // Map the database row to the CategoryInformation type
            const parentCategory: CategoryInfor = {
                categoryId: row.categoryId,
                iconName: row.iconName,
                title: row.title,
                description: row.description,
                subCategories: await getCategories(db, row.categoryId)
            };
            categories.push(parentCategory);
            // console.log("Category fetched:", parentCategory);
        }
        return categories;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

// #### CONTROLLER FUNCTIONS ####

async function get(req: express.Request, res: express.Response) {
    let db: Client | null = null;
    try {
        db = await database.getConnection();
        const categories = await getCategories(db, null);
        
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// async function getTopLevel(req: express.Request, res: express.Response) {
//     try {
//         const categories = await getCategories(true);
//         res.status(200).json(categories);
//     } catch (error: any) {
//         res.status(500).json({
//             message: "Error fetching categories",
//             errors: error.message
//         });
//     }
// }

const category = {
    get
    // getTopLevel
};

export default category;
