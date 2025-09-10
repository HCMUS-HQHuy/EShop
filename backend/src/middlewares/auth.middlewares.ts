import express from "express";
import jwt from "jsonwebtoken";

import { Client } from 'pg';
import database from 'src/database/index.database';
import * as types from "src/types/index.types";
import * as utils from "src/utils/index.utils";
import SOCKET_EVENTS from "src/constants/socketEvents";

async function auth(req: types.RequestCustom, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) token = req.cookies.auth_jwt; // Check cookies for token
    console.log("Auth token:", token, req.cookies);
    if (!token) return res.sendStatus(401);
    try {
        const { user_id, role } = jwt.verify(token, process.env.JWT_SECRET as string) as types.UserInfor;
        req.user = { user_id, role } as types.UserInfor;
        console.log(`Authenticated user: ${req.user.user_id}, Role: ${req.user.role}`);
        if (utils.isAdmin(req.user)) {
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
            SELECT u.user_id, u.role, s.shop_id, s.status as shop_status
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
        const infor: types.UserInfor = result.rows[0];
        req.user = {
            user_id: infor.user_id,
            role: infor.role,
            shop_id: infor.shop_id,
            shop_status: infor.shop_status
        } as types.UserInfor;
        req.io?.emit(SOCKET_EVENTS.LOGIN, 'logged in successfully');
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