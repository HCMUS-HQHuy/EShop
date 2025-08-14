import express from "express";
import jwt from "jsonwebtoken";
import { Client } from "pg";
import database from "database/index.database";
import * as types from "types/index.types";
import * as util from "utils/index.utils";

// #### VALIDATION FUNCTIONS ####

// #### DATABASE FUNCTIONS ####

async function checkUserExists(input: Partial<types.UserRegistration>): Promise<{
    usernameExists: boolean;
    emailExists: boolean;
}> {
    let db: Client | undefined;
    const result = {
        usernameExists: false,
        emailExists: false
    };
    try {
        db = await database.getConnection();

        const query = `
            SELECT username, email
            FROM users
            WHERE username = $1 OR email = $2
        `;
        const values = [input.username, input.email];
        const dbResult = await db.query(query, values);

        for (const row of dbResult.rows) {
            if (row.username === input.username) {
                result.usernameExists = true;
            }
            if (row.email === input.email) {
                result.emailExists = true;
            }
        }
        return result;
    } catch (error: any) {
        console.error("Database validation error:", error);
        return result;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function signup(registrationData: types.UserRegistration): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        registrationData.password = util.hashPassword(registrationData.password);
        
        const query =  `
            INSERT INTO users (username, password, email, role) 
            VALUES ($1, $2, $3, $4)
        `;
        await db.query(query, [
            registrationData.username,
            registrationData.password,
            registrationData.email,
            types.USER_ROLE.USER
        ]);
        console.log("User registered successfully");

    } catch (error: any) {
        console.error("Registration error:", error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
            console.log("Database connection released.");
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function login(req: express.Request, res: express.Response) {
    console.log("Login request received:", req.body);
    const parsedBody = types.autheFormSchemas.userCredentials.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(200).json({
            message: "error",
            error: true,
            data: [parsedBody.error.format()]
        });       
    }
    const credential: types.UserCredentials = parsedBody.data;

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const query =  `
            SELECT user_id, username, password, role
            FROM users WHERE username = $1
        `;
        const result = await db.query(query, [credential.username]);

        if (result.rows.length === 0)
            return res.status(401).json({
                message: "Invalid credentials"
            });
        const parsedUser = types.userSchemas.infor.safeParse(result.rows[0]);
        if (parsedUser.success === false)
            throw Error("Invalid user data");
        
        const password: string = result.rows[0].password;
        if (!util.comparePasswords(credential.password, password)) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const user: types.UserInfor = parsedUser.data;
        console.log("User authenticated successfully", user);
        const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1y" }); // 1y = 1 year for testing purposes

        return res.status(201).json({
            message: "Login successful",
            accessToken: token
        });
    } catch (error: any) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            message: "Authentication failed",
            errors: error.message || "Authentication failed"
        });
    }
}

async function registerUser(req: express.Request, res: express.Response) {
    console.log("Register request received:", req.body);
    const parsedBody = types.autheFormSchemas.userRegistration.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            message: "error",
            error: true,
            data: [parsedBody.error.format()]
        });
    }
    const registrationData: types.UserRegistration = parsedBody.data;

    // find data and check conditions for existing user
    try {
        const { usernameExists, emailExists } = await checkUserExists(registrationData);
        if (usernameExists || emailExists) {
            return res.status(400).json({
                message: "error",
                error: true,
                data: [{
                    username: usernameExists ? "User with this username already exists" : undefined,
                    email: emailExists ? "User with this email already exists" : undefined
                }]
            });
        }
    } catch (error: any) {
        console.error("Error checking user existence:", error);
        return res.status(500).json({
            message: "error",
            errors: true,
            data: [error.message]
        });
    }

    // update data for registration
    try {
        await signup(registrationData);
        return res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Registration failed",
            errors: error.message
        });
    }
}

const authenController = {
    login,
    registerUser
}

export default authenController;