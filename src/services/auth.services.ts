import jwt from "jsonwebtoken";
import { getConnection, releaseConnection } from "../config/db";
import * as types from "../types/index";
import { Client } from "pg";

export async function authenticate(credential: types.UserCredentials): Promise<string> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const query = "SELECT user_id, username, password, role FROM users WHERE username = $1";
        const result = await db.query(query, [credential.username]);

        if (result.rows.length === 0)
            throw new Error("Invalid credentials");

        if (result.rows.length > 1)
            throw new Error("Multiple users found with the same username and password");

        console.log("User authenticated successfully");
        const user: types.UserInfor = result.rows[0];
        const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "15m" });
        return token;
    } catch (error: any) {
        console.error("Authentication error:", error);
        console.error(`Authentication service error: ${error.message}`);
        throw error;
    } finally {
        if (db) {
            await releaseConnection(db);
            console.log("Database connection released.");
        }
    }
}
