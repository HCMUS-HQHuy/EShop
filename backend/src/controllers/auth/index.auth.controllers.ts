import express from "express";
import jwt from "jsonwebtoken";
import { Client } from "pg";
import database from "database/index.database";
import * as types from "types/index.types";
import * as util from "utils/index.utils";

// #### VALIDATION FUNCTIONS ####

// #### DATABASE FUNCTIONS ####

async function checkUserExists(input: Partial<types.UserRegistration>): Promise<types.ValidationResult> {
    const errors: Partial<Record<keyof types.UserRegistration, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const existingUserQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
        const existingUserResult = await db.query(existingUserQuery, [input.username, input.email]);

        if (existingUserResult.rows.length > 0) {
            throw new Error("User with this username or email already exists");
        }
    } catch (error: any) {
        console.error("Database validation error:", error);
        errors.username = "Existing user validation failed.";
    } finally {
        if (db) {
            await database.releaseConnection(db);
            console.log("Database connection released.");
        }
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

async function signup(registrationData: types.UserRegistration): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
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
            await database.releaseConnection(db);
            console.log("Database connection released.");
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function login(req: express.Request, res: express.Response) {
    const parsedBody = types.autheFormSchemas.userCredentials.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            error: "Invalid input",
            errors: parsedBody.error.format()
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
    const parsedBody = types.autheFormSchemas.userRegistration.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            error: "Invalid input",
            errors: parsedBody.error.format()
        });
    }
    const registrationData: types.UserRegistration = parsedBody.data;

    // find data and check conditions for existing user
    const userExistsResult = await checkUserExists(registrationData);
    if (!userExistsResult.valid) {
        return res.status(400).json({
            message: "User already exists",
            errors: userExistsResult.errors
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