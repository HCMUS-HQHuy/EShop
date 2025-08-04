import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";
import * as types from "../types/index.types";

export async function createSellerAccount (data: types.SellerAccountCreationRequest) {
    let db: Client  | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            INSERT INTO seller_profiles (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `;
        const values = [data.user_id, data.shop_name, data.shop_description || null];
        await db.query(sql, values);

    } catch (error) {
        console.error("Error creating seller account:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}

export async function updateSellerAccount(sellerId: number, status: types.SellerStatus, rejectionReason?: string) {
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

export async function updateUserStatus(userId: number, status: types.UserStatus) {
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