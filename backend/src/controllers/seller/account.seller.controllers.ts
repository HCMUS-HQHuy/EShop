import express from "express";

import { Client } from "pg";
import database from "database/index.database";

import * as types from "types/index.types";
import * as utils from "utils/index.utils";

// #### DATABASE FUNCTIONS ####

async function createSellerAccount(user_id: number, data: types.ShopCreationRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO shops (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `;
        const values = [user_id, data.shop_name, data.shop_description || null];
        await db.query(sql, values);

    } catch (error) {
        console.error("Error creating seller account:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}


// #### CONTROLLER FUNCTIONS ####

// This function handles the creation of a seller account
// It validates the request data and creates a new seller account in the database
// It requires the user to be logged in and have a valid user ID
async function create(req: types.RequestCustom, res: express.Response) {
    if (utils.isUser(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only users have permission to create a seller account." });
    }

    const parsedBody = types.shopSchemas.CreationRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
    }
    const requestData: types.ShopCreationRequest = {
        shop_name: parsedBody.data.shop_name,
        shop_description: parsedBody.data.shop_description
    };

    try {
        await createSellerAccount(req.user?.user_id as number, requestData);
        return res.status(201).json({
            message: "Seller account created successfully"
        });
    } catch (error) {
        console.error("Error creating seller account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const sellerAccountController = {
    create
};

export default sellerAccountController;
