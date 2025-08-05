import express from "express";
import jwt from "jsonwebtoken";

import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';
import * as types from "../types/index.types";
import * as utils from "../utils/index.util";

export async function auth(req: types.RequestCustom, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    try {
        const { user_id, role } = jwt.verify(token, process.env.JWT_SECRET as string) as types.UserInfor;
        req.user = { user_id, role } as types.UserInfor;
        if (utils.isAdmin(req)) {
            return next();
        }
    } catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(403).json({ errors: 'Invalid Token.' });
    }

    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT u.user_id, u.role, u.status, s.seller_profile_id
            FROM users as u 
                LEFT JOIN seller_profiles as s
                ON u.user_id = s.user_id
            WHERE u.user_id = $1 AND u.status = ${types.USER_STATUS.ACTIVE}
        `;
        const result = await db.query(sql, [req.user?.user_id]);
        if (result.rows.length === 0) {
            return res.status(403).json({ errors: 'Forbidden: User not found or inactive.' });
        }
        const user = result.rows[0];
        req.user = {
            user_id: user.user_id,
            role: types.USER_ROLE.USER,
            status: user.status,
            seller_profile_id: user.seller_profile_id || null
        } as types.UserInfor;
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ errors: 'Internal server error' });
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
}
