import express from "express";
import { Client } from "pg";
import { getConnection, releaseConnection } from "../../config/db";

import * as types from "../../types/index.types";
import * as util from "../../utils/index.utils";

// #### VALIDATION FUNCTIONS ####

function validateAdminRequestUpdateSeller(data: types.AdminVerifySellerRequest): types.ValidationResult {
    const errors: Partial<Record<string, string>> = {};

    if (!data.seller_id || typeof data.seller_id !== 'number') {
        errors.seller_id = "Invalid seller ID";
    }

    if (!data.status || (data.status !== types.SELLER_STATUS.ACTIVE && data.status !== types.SELLER_STATUS.REJECTED)) {
        errors.status = `Status must be either '${types.SELLER_STATUS.ACTIVE}' or '${types.SELLER_STATUS.REJECTED}'`;
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

async function checkSellerStatus(data: types.AdminVerifySellerRequest): Promise<types.ValidationResult> {
    const errors: Partial<Record<string, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        if (data.status === types.SELLER_STATUS.ACTIVE) {
            const sql = `
                SELECT COUNT(*) FROM seller_profiles
                WHERE user_id = $1 AND status IN ('${types.SELLER_STATUS.PENDING_VERIFICATION}', '${types.SELLER_STATUS.BANNED}')
            `;
            const result = await db.query(sql, [data.seller_id]);
            if (parseInt(result.rows[0].count, 10) === 0) {
                errors.seller_id = "Seller account not found or not pending verification or banned";
            }
        }
        else if (data.status === types.SELLER_STATUS.REJECTED) {
            const sql = `
                SELECT COUNT(*) FROM seller_profiles
                WHERE user_id = $1 AND status = '${types.SELLER_STATUS.PENDING_VERIFICATION}'
            `;
            const result = await db.query(sql, [data.seller_id]);
            if (parseInt(result.rows[0].count, 10) === 0) {
                errors.seller_id = "Seller account not found or not pending verification";
            }
        }
        else {
            errors.status = "Invalid status for seller account review";
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database validation failed");
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

function validateBlockUnblockUserRequest(data: types.BlockUnblockUserRequest): types.ValidationResult {
    const errors: Partial<Record<keyof types.BlockUnblockUserRequest, string>> = {};

    if (!data.user_id || typeof data.user_id !== 'number') {
        errors.user_id = "Invalid user ID";
    }

    if (!data.status || (data.status !== types.USER_STATUS.ACTIVE && data.status !== types.USER_STATUS.BANNED)) {
        errors.status = `Status must be either '${types.USER_STATUS.ACTIVE}' or '${types.USER_STATUS.BANNED}'`;
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
        db = await getConnection();
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
            releaseConnection(db);
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

// #### DATABASE FUNCTIONS ####

async function updateSellerAccount(sellerId: number, status: types.SellerStatus, rejectionReason?: string) {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            UPDATE seller_profiles SET status = $1, rejection_reason = $2 
            WHERE user_id = $3
        `;
        const values = [status, rejectionReason || null, sellerId];
        await db.query(sql, values);
    } catch (error) {
        console.error("Error updating seller account:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

async function updateUserStatus(userId: number, status: types.UserStatus) {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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
            releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

// This function handles the review of seller accounts by the admin
// It validates the request data and updates the seller account status in the database
// It updates the seller account status and optionally the rejection reason
async function reviewSeller(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can review seller accounts." });
    }

    const data: types.AdminVerifySellerRequest = req.body;

    // Validate the request data
    const validationError = validateAdminRequestUpdateSeller(data);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

    // Check the seller status in the database
    try {
        const statusCheck = await checkSellerStatus(data);
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

    // update the seller account status in the database
    try {
        await updateSellerAccount(data.seller_id, data.status, data.rejection_reason);
        return res.status(200).json({ message: "Seller account updated", sellerId: data.seller_id });
    } catch (error) {
        console.error("Error updating seller account:", error);
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

    const data: types.BlockUnblockUserRequest = req.body;

    const validationError = validateBlockUnblockUserRequest(data);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

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
    reviewSeller,
    reviewUser
}

export default account;