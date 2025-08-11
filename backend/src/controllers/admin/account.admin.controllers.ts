import express from "express";
import { Client } from "pg";
import database from "config/db";

import * as types from "types/index.types";
import * as util from "utils/index.utils";

// #### VALIDATION FUNCTIONS ####

// #### DATABASE FUNCTIONS ####

async function checkShopStatus(data: types.AdminVerifySellerRequest): Promise<types.ValidationResult> {
    const errors: Partial<Record<string, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        if (data.status === types.SHOP_STATUS.ACTIVE) {
            const sql = `
                SELECT COUNT(*) FROM shops
                WHERE shop_id = $1 AND status = '${types.SHOP_STATUS.PENDING_VERIFICATION}'
            `;
            const result = await db.query(sql, [data.shop_id]);
            if (parseInt(result.rows[0].count, 10) === 0) {
                errors.shop_id = "Shop account not found or not pending verification or banned";
            }
        }
        else if (data.status === types.SHOP_STATUS.REJECTED) {
            const sql = `
                SELECT COUNT(*) FROM shops
                WHERE shop_id = $1 AND status = '${types.SHOP_STATUS.PENDING_VERIFICATION}'
            `;
            const result = await db.query(sql, [data.shop_id]);
            if (parseInt(result.rows[0].count, 10) === 0) {
                errors.shop_id = "Shop account not found or not pending verification";
            }
        }
        else {
            errors.status = "Invalid status for shop account review";
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

async function updateShopStatus(shop_id: number, status: types.SellerStatus, rejectionReason?: string) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE shops SET status = $1, admin_note = $2 
            WHERE shop_id = $3
        `;
        const values = [status, rejectionReason || null, shop_id];
        await db.query(sql, values);
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

async function list(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can access this resource." });
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
async function reviewShop(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can review seller accounts." });
    }
    // Validate the request body
    const parsedBody = types.shopSchemas.AdminVerify.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
    }
    const data: types.AdminVerifySellerRequest = parsedBody.data;
    // Check the shop status in the database
    try {
        const statusCheck = await checkShopStatus(data);
        if (!statusCheck.valid) {
            return res.status(400).json({
                message: "Validation error",
                errors: statusCheck.errors
            });
        }
    } catch (error) {
        console.error("Error checking seller status:", error);
        return res.status(500).json({
            message: "Internal server error during status check"
        });
    }

    // update the shop account status in the database
    try {
        await updateShopStatus(data.shop_id, data.status, data.admin_note);
        return res.status(200).json({ message: "Shop account updated", shop_id: data.shop_id });
    } catch (error) {
        console.error("Error updating shop account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// This function handles the review of user accounts by the admin
// It validates the request data and updates the user status in the database
// It updates the user status to either 'Active' or 'Banned'
async function reviewUser(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can review user accounts." });
    }
    // Validate the request body
    const parsedBody = types.shopSchemas.BlockUnblock.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
    }
    const data: types.BlockUnblockUserRequest = parsedBody.data;

    // Check the user condition in the database
    try {
        const conditionCheck = await checkUserCondition(data);
        if (!conditionCheck.valid) {
            return res.status(400).json({
                message: "Validation error",
                errors: conditionCheck.errors
            });
        }
    } catch (error) {
        console.error("Error checking user condition:", error);
        return res.status(500).json({
            message: "Internal server error during condition check"
        });
    }

    try {
        await updateUserStatus(data.user_id, data.status);
        return res.status(200).json({ message: "User account updated", userId: data.user_id });
    } catch (error) {
        console.error("Error updating user account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const account = {
    reviewShop,
    reviewUser,
    list
}

export default account;