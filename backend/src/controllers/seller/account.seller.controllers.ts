import express from "express";

import { Client } from "pg";
import database from "database/index.database";

import * as types from "types/index.types";
import * as utils from "utils/index.utils";
import util from "utils/index.utils";

// #### DATABASE FUNCTIONS ####

async function createSellerAccount(user_id: number, data: types.ShopCreationRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO shops (user_id, shop_name, shop_description, address, email, phone_number) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [user_id, data.shop_name, data.shop_description, data.address, data.email, data.phone_number];
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
async function create(req: types.RequestCustom, res: express.Response) {
    if (utils.isUser(req) === false) {
        return res.status(403).json(util.response.error("Authorization Error", ['Only users have permission to create a seller account.']));
    }
    if (utils.isSeller(req)) {
        return res.status(403).json(util.response.error("Invalid Request", ['Sellers cannot create twice seller account.']));
    }

    const parsedBody = types.shopSchemas.CreationRequest.safeParse({
        shop_name: req.body.shopName,
        shop_description: req.body.shopDescription,
        address: req.body.address,
        email: req.body.businessEmail,
        phone_number: req.body.phoneNumber
    });

    if (!parsedBody.success) {
        console.error("Invalid request data:", utils.formatError(parsedBody.error));
        return res.status(400).send(util.response.error("Invalid request data", [utils.formatError(parsedBody.error)]));
    }
    const requestData: types.ShopCreationRequest = {
        shop_name: parsedBody.data.shop_name,
        shop_description: parsedBody.data.shop_description,
        address: parsedBody.data.address,
        email: parsedBody.data.email,
        phone_number: parsedBody.data.phone_number
    };

    try {
        await createSellerAccount(req.user?.user_id as number, requestData);
        return res.status(201).json(util.response.success("Seller account created successfully", []));
    } catch (error) {
        console.error("Error creating seller account:", error);
        return res.status(500).json(util.response.error("Internal server error", []));
    }
}

const sellerAccountController = {
    create
};

export default sellerAccountController;
