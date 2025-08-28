import express from "express";
import jwt from "jsonwebtoken";
import { Client } from "pg";
import crypto from "crypto";
import database from "database/index.database";
import * as types from "types/index.types";
import util from "utils/index.utils";
import services from "services/index.services";

async function insertIntoTokens(db: Client, userId: number, token: string) {
    const sql = `
        INSERT INTO tokens (user_id, token, created_at, expires_at)
        VALUES ($1, $2, $3, $4)
    `;
    const param = [userId, token, new Date(), new Date(Date.now() + 10 * 60 * 1000)];
    await db.query(sql, param);
    console.log("Token inserted into database", token);
}

async function deleteFromTokens(db: Client, userId: number, token: string): Promise<boolean> {
    console.log('delete token:', token);
    const tokenInDb = await db.query(`
        SELECT *
        FROM tokens
        WHERE user_id = $1 and token = $2 AND expires_at > NOW()
    `, [userId, token]);
    if (tokenInDb.rows.length === 0)
        return false;
    await db.query(`
        DELETE FROM tokens
        WHERE user_id = $1 AND token = $2
    `, [userId, token]);
    return true;
}

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
        const query = `
            SELECT user_id, username, password, role
            FROM users WHERE email = $1
        `;
        const result = await db.query(query, [credential.email]);

        if (result.rows.length === 0)
            return res.status(401).json({
                message: "Invalid credentials"
            });
        const password: string = result.rows[0].password;
        if (!util.password.compare(credential.password, password)) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const user: types.UserInfor = result.rows[0];
        const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1y" }); // 1y = 1 year for testing purposes
        res.cookie("auth_jwt", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
        });
        return res.status(201).json({
            message: "successful",
            error: false,
            data: [user]
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
        console.error("Validation error:", req.body, parsedBody.error);
        return res.status(400).json(util.response.zodValidationError(parsedBody.error));
    }
    const registrationData: types.UserRegistration = parsedBody.data;

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const { email, username, password } = registrationData;
        const hashedPassword = util.password.hash(password);
        {
            const query = `
                SELECT username, email
                FROM users
                WHERE username = $1 OR email = $2
            `;
            const values = [username, email];
            const dbResult = await db.query(query, values);
            const result = { username: '', email: '' };
            for (const row of dbResult.rows) {
                if (row.username === username) {
                    result.username = 'Username is already taken';
                }
                if (row.email === email) {
                    result.email = 'Email is already exists';
                }
            }
            if (result.username !== '' || result.email !== '') {
                return res.status(400).json(util.response.error("Validation error", [result]));
            }
        }
        await db.query("BEGIN");

        const query = `
            INSERT INTO users (username, password, email, role) 
            VALUES ($1, $2, $3, $4)
            RETURNING user_id
        `;
        const result = await db.query(query, [
            username,
            hashedPassword,
            email,
            types.USER_ROLE.USER
        ]);
        const userId: number = result.rows[0].user_id;

        const token = jwt.sign({ userId, email, username }, process.env.JWT_SECRET as string, { expiresIn: "10m" });
        await insertIntoTokens(db, userId, token);
        const url = `${process.env.BASE_API_URL}/auth/verify-email?token=${token}`;
        await services.email.sendVerify(email, username, url);
        await db.query("COMMIT");
        return res.status(201).json(util.response.success("User registered successfully. Please verify your email."));
    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json(util.response.internalServerError());
    } finally {
        if (db)
            database.releaseConnection(db);
    }
}

async function verifyEmail(req: express.Request, res: express.Response) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const token = req.query.token as string;
        jwt.verify(token, process.env.JWT_SECRET as string);
        const payload = jwt.decode(token) as { userId: string, email: string, username: string };

        if (await deleteFromTokens(db, Number(payload.userId), token) === false) {
            return res.status(400).json(util.response.error("Invalid token"));
        }
        const query = `
            UPDATE users
            SET is_verified = TRUE
            WHERE user_id = $1 AND username = $2
        `;
        await db.query(query, [payload.userId, payload.username]);
        return res.redirect(`${process.env.FRONT_END_URL}/login`);
    } catch (error: any) {
        console.error("Error getting database connection:", error);
        return res.status(500).json(util.response.internalServerError());
    } finally {
        if (db)
            database.releaseConnection(db);
    }
}

async function forgotPassword(req: express.Request, res: express.Response) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query("BEGIN");
        const { email } = req.body;
        const user = await db.query(`
            SELECT *
            FROM users
            WHERE email = $1
        `, [email]);
        if (user.rows.length === 0) {
            return res.status(404).json(util.response.error("User not found"));
        }
        const newPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);
        await services.email.sendResetPassword(email, user.rows[0].username, newPassword);
        const hashedPassword = util.password.hash(newPassword);
        await db.query(`
            UPDATE users
            SET password = $1
            WHERE user_id = $2
        `, [hashedPassword, user.rows[0].user_id]);
        await db.query(`COMMIT`);
        return res.status(200).json(util.response.success("Password reset email sent"));
    } catch (error: any) {
        console.error("Error getting database connection:", error);
        if (db)
            await db.query("ROLLBACK");
        return res.status(500).json(util.response.internalServerError());
    } finally {
        if (db)
            database.releaseConnection(db);
    }
}

// async function resetPassword(req: express.Request, res: express.Response) {
//     let db: Client | undefined = undefined;
//     try {
//         db = await database.getConnection();
//         const token = req.query.token as string;
//         jwt.verify(token, process.env.JWT_SECRET as string);
//         const payload = jwt.decode(token) as { userId: string };

//         if (await deleteFromTokens(db, Number(payload.userId), token) === false) {
//             return res.status(400).json(util.response.error("Invalid token"));
//         }
//         const { password } = req.body; // validate later
//         const hashedPassword = util.password.hash(password);
//         const query = `
//             UPDATE users
//             SET password = $1
//             WHERE user_id = $2
//         `;
//         await db.query(query, [hashedPassword, payload.userId]);
//     } catch (error: any) {
//         console.error("Error getting database connection:", error);
//         return res.status(500).json(util.response.internalServerError());
//     } finally {
//         if (db)
//             database.releaseConnection(db);
//     }
// }

function logout(req: express.Request, res: express.Response) {
    res.clearCookie("auth_jwt");
    return res.status(200).json({
        message: "successful",
        error: false,
        data: []
    });
}

const authenController = {
    login,
    registerUser,
    verifyEmail,
    forgotPassword,
    // resetPassword,
    logout
}

export default authenController;