import { Client } from "pg";
import { getConnection, releaseConnection } from "../../config/db";
import * as types from "../../types/index.types";

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