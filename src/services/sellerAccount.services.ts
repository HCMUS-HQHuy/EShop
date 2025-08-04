import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";
import * as types from "../types/index.types";

export async function createSellerAccount (data: types.SellerAccountCreationRequest) {
    let db: Client  | undefined = undefined;
    try {
        db = await getConnection();
        const sql = 'INSERT INTO seller_profiles (user_id, shop_name, shop_description) VALUES ($1, $2, $3)';
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