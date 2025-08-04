import express from 'express';
import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';

import * as types from '../types/index.types';

async function getShopName(userId: number): Promise<string | null> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = 'SELECT shop_name FROM seller_profiles WHERE user_id = $1';
        const result = await db.query(sql, [userId]);
        if (result.rows.length > 0) {
            return result.rows[0].shop_name;
        }
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (db) {
            releaseConnection(db);
        }
    }
    return null;
}

export const checkRole = (allowedRoles: types.Role) => {
    return async (req: types.RequestCustom, res: express.Response, next: express.NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: 'Authentication required.' });
        }
        if (!user.role) {
            return res.status(403).json({ errors: 'Forbidden: User role is not defined.' });
        }
        switch (allowedRoles) {
            case types.Role.Admin:
                if (user.role !== types.Role.Admin) {
                    return res.status(403).json({ errors: 'Forbidden: You do not have permission to perform this action.' });
                }
                break;
            case types.Role.User:
                if (user.role as types.Role !== types.Role.User) {
                    return res.status(403).json({ errors: 'Forbidden: You do not have permission to perform this action.' });
                }
                break;
            case types.Role.Seller:
                const shopName: string|null = await getShopName(user.user_id);
                if (!shopName) {
                    return res.status(403).json({ errors: 'Forbidden: You do not have permission to perform this action.' });
                }
                if (req.user) {
                    req.user.shop_name = shopName;
                }
                break;
        }
        next();
    };
};