import jwt from "jsonwebtoken";
import { Client } from "pg";
import { getConnection, releaseConnection } from "../config/db";
import * as types from "../types/index.types";
import * as util from "../utils/index.utils";

export async function login(credential: types.UserCredentials): Promise<string> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const query =  `
            SELECT user_id, username, password, role
            FROM users WHERE username = $1
        `;
        const result = await db.query(query, [credential.username]);

        if (result.rows.length === 0)
            throw new Error("Invalid credentials");

        if (result.rows.length > 1)
            throw new Error("Multiple users found with the same username and password");

        const password: string = result.rows[0].password;
        if (!util.comparePasswords(credential.password, password)) {
            throw new Error("Invalid credentials");
        }
        const user: types.UserInfor = result.rows[0];
        console.log("User authenticated successfully");
        const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1y" }); // 1y = 1 year for testing purposes
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

export async function signup(registrationData: types.UserRegistration): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        registrationData.password = util.hashPassword(registrationData.password);
        
        const query =  `
            INSERT INTO users (username, password, email, fullname, role) 
            VALUES ($1, $2, $3, $4, $5)
        `;
        await db.query(query, [
            registrationData.username,
            registrationData.password,
            registrationData.email,
            registrationData.fullname,
            types.USER_ROLE.USER
        ]);
        console.log("User registered successfully");

    } catch (error: any) {
        console.error("Registration error:", error);
        throw error;
    } finally {
        if (db) {
            await releaseConnection(db);
            console.log("Database connection released.");
        }
    }
}