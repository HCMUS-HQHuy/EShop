import express from "express";

import { Client } from "pg";
import database from "../../config/db";

import * as types from "../../types/index.types";
import * as utils from "../../utils/index.utils";

// #### VALIDATION FUNCTIONS ####

function validateSellerAccountCreationRequest(data: types.SellerAccountCreationRequest) {
    const errors: Partial<Record<keyof types.SellerAccountCreationRequest, string>> = {};

    if (!data.shop_name || data.shop_name.trim() === "") {
        errors.shop_name = "Shop name must not be empty";
    }
    if (data.shop_description && data.shop_description.length > 500) {
        errors.shop_description = "Shop description must not exceed 500 characters";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

// #### DATABASE FUNCTIONS ####

async function createSellerAccount(data: types.SellerAccountCreationRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO shops (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `;
        const values = [data.user_id, data.shop_name, data.shop_description || null];
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

    const requestData: types.SellerAccountCreationRequest = {
        user_id: req.user?.user_id as number,
        shop_name: req.body.shop_name,
        shop_description: req.body.shop_description || undefined
    };

    const validationError = validateSellerAccountCreationRequest(requestData);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

    try {
        await createSellerAccount(requestData);
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
