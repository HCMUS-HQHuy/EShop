import express from "express";

import { Client } from "pg";
import database from "database/index.database";
import util from "utils/index.utils";
import schemas from "schemas/index.schema";

import { ShopCreationRequest, RequestCustom } from "types/index.types";

// #### DATABASE FUNCTIONS ####

async function createSellerAccount(user_id: number, data: ShopCreationRequest) {
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
async function create(req: RequestCustom, res: express.Response) {
    if (util.role.isUser(req.user) === false) {
        return res.status(403).json(util.response.authorError('users'));
    }
    if (util.role.isSeller(req.user)) {
        return res.status(403).json(util.response.error('Sellers cannot create twice seller account.'));
    }

    const parsedBody = schemas.shop.creationRequest.safeParse({
        shop_name: req.body.shopName,
        shop_description: req.body.shopDescription,
        address: req.body.address,
        email: req.body.businessEmail,
        phone_number: req.body.phoneNumber
    });

    if (!parsedBody.success) {
        console.error("Invalid request data:", util.formatError(parsedBody.error));
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const requestData: ShopCreationRequest = {
        shop_name: parsedBody.data.shop_name,
        shop_description: parsedBody.data.shop_description,
        address: parsedBody.data.address,
        email: parsedBody.data.email,
        phone_number: parsedBody.data.phone_number
    };

    try {
        await createSellerAccount(req.user?.user_id as number, requestData);
        return res.status(201).json(util.response.success("Seller account created successfully"));
    } catch (error) {
        console.error("Error creating seller account:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function getInformation(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shop_id as number;
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT shop_name, email, phone_number, shop_description, address, status
            FROM shops
            WHERE shop_id = $1
        `;
        const result = await db.query(sql, [shopId]);
        const shopInfo = {
            name: result.rows[0].shop_name,
            email: result.rows[0].email,
            phoneNumber: result.rows[0].phone_number,
            description: result.rows[0].shop_description,
            address: result.rows[0].address,
            status: result.rows[0].status
        };
        return res.status(200).json(util.response.success("Seller information retrieved successfully", { shopInfo: shopInfo }));
    } catch (error) {
        console.error("Error fetching seller information:", error);
        return res.status(500).json(util.response.internalServerError());
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

const sellerAccountController = {
    create,
    getInformation
};

export default sellerAccountController;
