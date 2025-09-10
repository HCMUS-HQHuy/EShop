import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import util from "src/utils/index.utils";
import services from "src/services/index.services";
import schemas from "src/schemas/index.schema";
import prisma from "src/models/prismaClient";

import { USER_ROLE } from "src/types/index.types";
import { LoginForm, RegisterForm, UserInfor } from "src/types/index.types";

// async function deleteFromTokens(db: Client, userId: number, token: string): Promise<boolean> {
//     console.log('delete token:', token);
//     const tokenInDb = await db.query(`
//         SELECT *
//         FROM tokens
//         WHERE user_id = $1 and token = $2 AND expires_at > NOW()
//     `, [userId, token]);
//     if (tokenInDb.rows.length === 0)
//         return false;
//     await db.query(`
//         DELETE FROM tokens
//         WHERE user_id = $1 AND token = $2
//     `, [userId, token]);
//     return true;
// }

async function validateToken(req: express.Request, res: express.Response) {
    const token = req.cookies["auth_jwt"];
    if (!token) {
        return res.status(200).json(util.response.error("No token provided"));
    }
    return res.status(200).json(util.response.success("Token is valid"));
}

async function login(req: express.Request, res: express.Response) {
    const parsedBody = schemas.form.login.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(200).json(util.response.zodValidationError(parsedBody.error));
    }
    const credential: LoginForm = parsedBody.data;
    try {
        const userInfo = await prisma.users.findFirst({
            where: {
                email: credential.email
            },
            select: {
                user_id: true,
                username: true,
                password: true,
                role: true
            }
        });
        console.log("User info from DB:", userInfo);
        if (userInfo === null) {
            return res.status(401).json(util.response.error("Invalid credentials"));
        }
        if (!util.password.compare(credential.password, userInfo.password)) {
            console.log("Invalid password");
            return res.status(401).json(util.response.error("Invalid credentials"));
        }
        const user: UserInfor = { user_id: userInfo.user_id, username: userInfo.username, role: userInfo.role as USER_ROLE };
        const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1y" }); // 1y = 1 year for testing purposes
        res.cookie("auth_jwt", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
        });
        console.log("User logged in:", user);
        return res.status(201).json(util.response.success("Login successful", {userInfor: user}));
    } catch (error: any) {
        console.error("Authentication error:", error);
        return res.status(501).json(util.response.internalServerError());
    }
}

// async function registerUser(req: express.Request, res: express.Response) {
//     const parsedBody = schemas.form.register.safeParse(req.body);
//     if (!parsedBody.success) {
//         console.error("Validation error:", req.body, parsedBody.error);
//         return res.status(400).json(util.response.zodValidationError(parsedBody.error));
//     }
//     const registrationData: RegisterForm = parsedBody.data;

//     let db: Client | undefined = undefined;
//     try {
//         db = await database.getConnection();
//         const { email, username, password } = registrationData;
//         const hashedPassword = util.password.hash(password);
//         {
//             const query = `
//                 SELECT username, email
//                 FROM users
//                 WHERE username = $1 OR email = $2
//             `;
//             const values = [username, email];
//             const dbResult = await db.query(query, values);
//             const result = { username: '', email: '' };
//             for (const row of dbResult.rows) {
//                 if (row.username === username) {
//                     result.username = 'Username is already taken';
//                 }
//                 if (row.email === email) {
//                     result.email = 'Email is already exists';
//                 }
//             }
//             if (result.username !== '' || result.email !== '') {
//                 return res.status(400).json(util.response.error("Validation error", [result]));
//             }
//         }
//         await db.query("BEGIN");

//         const query = `
//             INSERT INTO users (username, password, email, role) 
//             VALUES ($1, $2, $3, $4)
//             RETURNING user_id
//         `;
//         const result = await db.query(query, [
//             username,
//             hashedPassword,
//             email,
//             USER_ROLE.USER
//         ]);
//         const userId: number = result.rows[0].user_id;
//         console.log("New user registered with ID:", userId);
//         const token = jwt.sign({ userId, email, username }, process.env.JWT_SECRET as string, { expiresIn: "10m" });
//         console.log("Email verification token generated:", token);
//         await insertIntoTokens(db, userId, token);
//         console.log("Token stored in database for user ID:", userId);
//         const url = `${process.env.BASE_API_URL}/auth/verify-email?token=${token}`;
//         await services.email.sendVerify(email, username, url);
//         console.log("Sent email verification link to:", email);
//         await db.query("COMMIT");
//         return res.status(201).json(util.response.success("User registered successfully. Please verify your email."));
//     } catch (error: any) {
//         console.error("Registration error:", error);
//         return res.status(500).json(util.response.internalServerError());
//     } finally {
//         if (db)
//             database.releaseConnection(db);
//     }
// }

async function registerUser(req: express.Request, res: express.Response) {
    const parsedBody = schemas.form.register.safeParse(req.body);
    if (!parsedBody.success) {
        console.error("Validation error:", req.body, parsedBody.error);
        return res.status(400).json(util.response.zodValidationError(parsedBody.error));
    }
    const registrationData: RegisterForm = parsedBody.data;
    const { email, username, password } = registrationData;
    const hashedPassword = util.password.hash(password);

    try {
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        });
        if (existingUser) {
            const result = { username: '', email: '' };
            if (existingUser.username === username) {
                result.username = 'Username is already taken';
            }
            if (existingUser.email === email) {
                result.email = 'Email is already exists';
            }
            if (result.username !== '' || result.email !== '') {
                return res.status(400).json(util.response.error("Validation error", [result]));
            }
        }
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json(util.response.internalServerError());
    }

    try {
        const userInfor = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                email: email,
                role: USER_ROLE.USER,
                is_verified: true // Set to true for testing purposes, change to false in production
            }
        });
        const userId: number = userInfor.user_id;
        console.log("New user registered with ID:", userId);
        return res.status(201).json(util.response.success("User registered successfully. Please verify your email."));
    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function verifyEmail(req: express.Request, res: express.Response) {
    try {
        const token = req.query.token as string;
        jwt.verify(token, process.env.JWT_SECRET as string);
        const payload = jwt.decode(token) as { userId: string, email: string, username: string };

        const deletedTokens = await prisma.tokens.deleteMany({
            where: {
                user_id: Number(payload.userId),
                token: token
            }
        });
        if (deletedTokens.count === 0) {
            return res.status(400).json(util.response.error("Invalid token"));
        }

        await prisma.users.update({
            where: {
                user_id: Number(payload.userId)
            },
            data: {
                is_verified: true
            }
        });
        return res.redirect(`${process.env.FRONT_END_URL}/login`);
    } catch (error: any) {
        console.error("Error getting database connection:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function forgotPassword(req: express.Request, res: express.Response) {
    try {
        const userInfo = await prisma.users.findFirst({
            where: { email: req.body.email },
            select: { email: true, username: true, user_id: true }
        })

        if (userInfo === null) {
            return res.status(404).json(util.response.error("User not found"));
        }
        const newPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);
        await services.email.sendResetPassword(userInfo.email, userInfo.username, newPassword);
        const hashedPassword = util.password.hash(newPassword);

        await prisma.users.update({
            where: { user_id: userInfo.user_id },
            data: { password: hashedPassword }
        })
        return res.status(200).json(util.response.success("Password reset email sent", {
            email: userInfo.email,
            redirect: true,
            redirectUrl: '/login'
        }));
    } catch (error: any) {
        console.error("Error getting database connection:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function resetPassword(req: express.Request, res: express.Response) {
    try {
        const token = req.query.token as string;
        jwt.verify(token, process.env.JWT_SECRET as string);
        const payload = jwt.decode(token) as { userId: string };

        const deletedTokens = await prisma.tokens.deleteMany({
            where: {
                user_id: Number(payload.userId),
                token: token
            }
        });
        if (deletedTokens.count === 0) {
            return res.status(400).json(util.response.error("Invalid token"));
        }

        const { password } = req.body; // validate later
        const hashedPassword = util.password.hash(password);
        await prisma.users.update({
            where: { user_id: Number(payload.userId) },
            data: { password: hashedPassword }
        });
        return res.status(200).json(util.response.success("Password has been reset successfully"));
    } catch (error: any) {
        console.error("Error getting database connection:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

function logout(req: express.Request, res: express.Response) {
    res.clearCookie("auth_jwt");
    return res.status(200).json(util.response.success("Logout successful"));
}

const authenController = {
    validateToken,
    login,
    registerUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout
}

export default authenController;