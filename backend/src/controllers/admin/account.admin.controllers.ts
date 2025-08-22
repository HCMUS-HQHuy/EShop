import express from "express";
import { Client } from "pg";
import database from "database/index.database";

import * as types from "types/index.types";
import { SOCKET_EVENTS } from "constants/socketEvents";
import util from "utils/index.utils";
// #### VALIDATION FUNCTIONS ####

// #### DATABASE FUNCTIONS ####

async function checkShopExist(data: types.AdminVerifySellerRequest): Promise<boolean> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT COUNT(*) FROM shops
            WHERE shop_id = $1
        `;
        const result = await db.query(sql, [data.shop_id]);
        return (parseInt(result.rows[0].count, 10) > 0);
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database validation failed");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function checkUserCondition(data: types.BlockUnblockUserRequest): Promise<types.ValidationResult> {
    const errors: Partial<Record<keyof types.BlockUnblockUserRequest, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT COUNT(*) FROM users 
            WHERE user_id = $1 AND status = $2
        `;
        const status = data.status === types.USER_STATUS.BANNED ? types.USER_STATUS.ACTIVE : types.USER_STATUS.BANNED;
        const result = await db.query(sql, [data.user_id, status]);
        if (parseInt(result.rows[0].count, 10) === 0) {
            errors.user_id = "User account not found or not banned";
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database validation failed");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

async function updateShopStatus(shop_id: number, status: types.ShopStatus, rejectionReason?: string) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE shops SET status = $1, admin_note = $2 
            WHERE shop_id = $3
            RETURNING user_id, status, admin_note;
        `;
        const values = [status, rejectionReason || null, shop_id];
        const value = await db.query(sql, values);
        return value.rows[0];
    } catch (error) {
        console.error("Error updating shop account:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function updateUserStatus(userId: number, status: types.UserStatus) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE users SET status = $1
            WHERE user_id = $2
        `;
        const values = [status, userId];
        await db.query(sql, values);
    } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: types.RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT u.user_id, u.username, s.shop_id, s.shop_name, s.status
            FROM users AS u
            LEFT JOIN shops AS s ON u.user_id = s.user_id
            WHERE s.status = '${types.SHOP_STATUS.PENDING_VERIFICATION}'
        `;
        const result = await db.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching seller accounts:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// This function handles the review of seller accounts by the admin
// It validates the request data and updates the shop account status in the database
// It updates the shop account status and optionally the rejection reason
async function reviewShop(req: types.RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }

    // const getInfoShop = {}

    // foreign key -> user -> user_id
    // check user_id -> shop -> ok?

    //--- 

    // ok -> 

    // const dataConfig = {
    //     user_id: getInfoShop.user_id,
    //     shop_id: getInfoShop.shop_id,
    //     status: getInfoShop.status,
    //     admin_note: getInfoShop.admin_note
    // }

    // io.emit(to [room, user_id ] -> emmit  eventSOket (access shop / denied shop) -> dataConfig)

    // --- 
// not ok ->


// ======

// client

// socket -> io.on(accessShop)

// function handleAccessshop(data -> dataConfig của event) { 
// check condition -> user_id && shop_id

// true -> login / reload data -> show access/denied


// }
    // Validate the request body
    const parsedBody = types.shopSchemas.AdminVerify.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.error('Invalid request data', [util.formatError(parsedBody.error)]));
    }
    const data: types.AdminVerifySellerRequest = parsedBody.data;
    // Check the shop status in the database
    try {
        if (await checkShopExist(data) === false) {
            return res.status(400).json(util.response.error('Invalid request', ['Shop does not exist']));
        }
    } catch (error) {
        console.error("Error checking seller status:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error checking seller status']));
    }

    // update the shop account status in the database
    try {
        const dataConfig = await updateShopStatus(data.shop_id, data.status, data.admin_note);
        const io = req?.io;
        if (io === undefined) 
            throw Error("Socket IO instance is not available");
        const responseData = {
            shopStatus: dataConfig.status,
            adminNote: dataConfig.admin_note,
        }
        console.log('responsedata: ', responseData);
        io.of('/seller').to(`shop_id_${data.shop_id}`).emit(SOCKET_EVENTS.SET_SHOP_STATUS, responseData);
        return res.status(200).json(util.response.success("Shop account updated", [`shop :${data.shop_id}`]));
    } catch (error) {
        console.error("Error updating shop account:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error updating shop account']));
    }
}

// This function handles the review of user accounts by the admin
// It validates the request data and updates the user status in the database
// It updates the user status to either 'Active' or 'Banned'
async function reviewUser(req: types.RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    // Validate the request body
    const parsedBody = types.shopSchemas.BlockUnblock.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.error('Invalid request data', [util.formatError(parsedBody.error)]));
    }
    const data: types.BlockUnblockUserRequest = parsedBody.data;

    // Check the user condition in the database
    try {
        const conditionCheck = await checkUserCondition(data);
        if (!conditionCheck.valid) {
            return res.status(400).json(util.response.error('Validation error', [conditionCheck.errors]));
        }
    } catch (error) {
        console.error("Error checking user condition:", error);
        return res.status(500).json(util.response.error('Internal server error during condition check', ['Error checking user condition']));
    }

    try {
        await updateUserStatus(data.user_id, data.status);
        return res.status(200).json(util.response.success("User account updated", [data.user_id]));
    } catch (error) {
        console.error("Error updating user account:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error updating user account']));
    }
}

const account = {
    reviewShop,
    reviewUser,
    list
}

export default account;