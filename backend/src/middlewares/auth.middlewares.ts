import express from "express";
import jwt from "jsonwebtoken";

import { Client } from 'pg';
import database from 'database/index.database';
import * as types from "types/index.types";
import * as utils from "utils/index.utils";

async function auth(req: types.RequestCustom, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    try {
        const { user_id, role } = jwt.verify(token, process.env.JWT_SECRET as string) as types.UserInfor;
        req.user = { user_id, role } as types.UserInfor;
        console.log(`Authenticated user: ${req.user.user_id}, Role: ${req.user.role}`);
        if (utils.isAdmin(req)) {
            return next();
        }
    } catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(403).json({ errors: 'Invalid Token.' });
    }

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT u.user_id, u.role, s.shop_id, s.status
            FROM users as u
                LEFT JOIN shops as s
                ON u.user_id = s.user_id
            WHERE u.user_id = $1
                AND u.status = '${types.USER_STATUS.ACTIVE}'
        `;
        const result = await db.query(sql, [req.user?.user_id]);
        if (result.rows.length === 0) {
            return res.status(403).json({ errors: 'Forbidden: User not found or inactive.' });
        }
        const user = result.rows[0];
        req.user = {
            user_id: user.user_id,
            role: types.USER_ROLE.USER,
            shop_id: user.status === types.SHOP_STATUS.ACTIVE ? user.shop_id : null
        } as types.UserInfor;
        console.log('request.user in seller account:', req.user);
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ errors: 'Internal server error' });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### EXPORTS ####
export default auth;