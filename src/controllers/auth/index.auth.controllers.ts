import express from "express";
import jwt from "jsonwebtoken";
import { Client } from "pg";
import { getConnection, releaseConnection } from "../../config/db";
import * as types from "../../types/index.types";
import * as util from "../../utils/index.utils";

// #### VALIDATION FUNCTIONS ####

function validateCredentials(input: Partial<types.UserCredentials>): types.ValidationResult {
    const errors: Partial<Record<keyof types.UserCredentials, string>> = {};

    if (input.username !== undefined) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!input.username) {
            errors.username = "Username is required.";
        } else if (!usernameRegex.test(input.username)) {
            errors.username = "Username must be 3-20 characters and only contain letters, numbers, and underscores.";
        }
    }

    if (input.password !== undefined) {
        if (!input.password) {
            errors.password = "Password is required.";
        } else if (input.password.length < 8 || input.password.length > 50) {
            errors.password = "Password must be between 8 and 50 characters.";
        } else if (!/[a-z]/.test(input.password)) {
            errors.password = "Password must contain at least one lowercase letter.";
        } else if (!/[A-Z]/.test(input.password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(input.password)) {
            errors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(input.password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

async function validateRegistration(input: Partial<types.UserRegistration>): Promise<types.ValidationResult> {
    const errors: Partial<Record<keyof types.UserRegistration, string>> = {};

    if (input.username !== undefined) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!input.username) {
            errors.username = "Username is required.";
        } else if (!usernameRegex.test(input.username)) {
            errors.username = "Username must be 3-20 characters and only contain letters, numbers, and underscores.";
        }
    }

    if (input.password !== undefined) {
        if (!input.password) {
            errors.password = "Password is required.";
        } else if (input.password.length < 8 || input.password.length > 50) {
            errors.password = "Password must be between 8 and 50 characters.";
        } else if (!/[a-z]/.test(input.password)) {
            errors.password = "Password must contain at least one lowercase letter.";
        } else if (!/[A-Z]/.test(input.password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(input.password)) {
            errors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(input.password)) {
            errors.password = "Password must contain at least one special character.";
        }
    }

    if (input.confirmPassword !== undefined) {
        if (!input.confirmPassword) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (input.password && input.confirmPassword !== input.password) {
            errors.confirmPassword = "Passwords do not match.";
        }
    }

    if (input.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!input.email) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(input.email)) {
            errors.email = "Email format is invalid.";
        }
    }

    if (input.fullname !== undefined) {
        if (!input.fullname) {
            errors.fullname = "Full name is required.";
        } else if (input.fullname.length < 2 || input.fullname.length > 100) {
            errors.fullname = "Full name must be between 2 and 100 characters.";
        }
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

// #### DATABASE FUNCTIONS ####

async function checkUserExists(input: Partial<types.UserRegistration>): Promise<types.ValidationResult> {
    const errors: Partial<Record<keyof types.UserRegistration, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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
            await releaseConnection(db);
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

// #### CONTROLLER FUNCTIONS ####

async function login(req: express.Request, res: express.Response) {
    const credential: types.UserCredentials = req.body;
    const validationResult = validateCredentials(credential);

    if (!validationResult.valid) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validationResult.errors
        });
    }

    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const query =  `
            SELECT user_id, username, password, role
            FROM users WHERE username = $1
        `;
        const result = await db.query(query, [credential.username]);

        if (result.rows.length === 0)
            return res.status(401).json({
                message: "Invalid credentials"
            });

        const password: string = result.rows[0].password;
        if (!util.comparePasswords(credential.password, password)) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const user: types.UserInfor = result.rows[0];
        console.log("User authenticated successfully");
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
    const registrationData: types.UserRegistration = req.body;
    const validationResult = await validateRegistration(registrationData);
    // validate registration data
    if (!validationResult.valid) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validationResult.errors 
        });
    }

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