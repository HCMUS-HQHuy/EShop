import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';

import * as types from '../types/index.types';

export async function validateSellerAccountCreationRequest(data: types.SellerAccountCreationRequest): Promise<types.ValidationSellerAccountResult> {
    const errors: Partial<Record<keyof types.SellerAccountCreationRequest, string>> = {};
    
    if (!data.user_id || typeof data.user_id !== 'number') {
        errors.user_id = "Invalid user ID";
    }

    if (!data.shop_name || typeof data.shop_name !== 'string' || data.shop_name.trim() === "") {
        errors.shop_name = "Shop name is required and must be a non-empty string";
    }
    else if (data.shop_name.length < 3 || data.shop_name.length > 50) {
        errors.shop_name = "Shop name must be between 3 and 50 characters";
    }

    if (data.shop_description && typeof data.shop_description !== 'string') {
        errors.shop_description = "Shop description must be a string if provided";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

export async function validateAdminRequestUpdateSeller(data: types.AdminVerifySellerRequest): Promise<types.ValidationUpdatingAccountResult> {
    const errors: Partial<Record<keyof types.AdminVerifySellerRequest, string>> = {};

    if (!data.seller_id || typeof data.seller_id !== 'number') {
        errors.seller_id = "Invalid seller ID";
    }

    if (!data.status || (data.status !== types.SELLER_STATUS.ACTIVE && data.status !== types.SELLER_STATUS.REJECTED)) {
        errors.status = `Status must be either '${types.SELLER_STATUS.ACTIVE}' or '${types.SELLER_STATUS.REJECTED}'`;
    }

    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT COUNT(*) FROM seller_profiles 
            WHERE user_id = $1 AND status = '${types.SELLER_STATUS.PENDING_VERIFICATION}'
        `;
        const result = await db.query(sql, [data.seller_id]);
        if (parseInt(result.rows[0].count, 10) === 0) {
            errors.seller_id = "Seller account not found or not pending verification";
        }
        if (data.status === types.SELLER_STATUS.REJECTED && (!data.rejection_reason || typeof data.rejection_reason !== 'string' || data.rejection_reason.trim() === "")) {
            errors.rejection_reason = "Rejection reason is required when status is 'Rejected'";
        } else if (data.rejection_reason && (data.rejection_reason.length < 10 || data.rejection_reason.length > 200)) {
            errors.rejection_reason = "Rejection reason must be between 10 and 200 characters";
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

export async function validateBlockUnblockUserRequest(data: types.BlockUnblockUserRequest): Promise<types.ValidationUpdatingAccountResult> {
    const errors: Partial<Record<keyof types.BlockUnblockUserRequest, string>> = {};

    if (!data.user_id || typeof data.user_id !== 'number') {
        errors.user_id = "Invalid user ID";
    }

    if (!data.status || (data.status !== types.USER_STATUS.ACTIVE && data.status !== types.USER_STATUS.BANNED)) {
        errors.status = `Status must be either '${types.USER_STATUS.ACTIVE}' or '${types.USER_STATUS.BANNED}'`;
    }

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

