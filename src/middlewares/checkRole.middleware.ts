import express from 'express';
import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';

import * as types from '../types/index.types';

async function getShopName(userId: number): Promise<string | null> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT shop_name FROM seller_profiles 
            WHERE user_id = $1 AND status IN ('Active', 'Closed')
        `;
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

export const checkRole = (allowedRoles: types.UserRole) => {
    return async (req: types.RequestCustom, res: express.Response, next: express.NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: 'Authentication required.' });
        }
        if (!user.role) {
            return res.status(403).json({ errors: 'Forbidden: User role is not defined.' });
        }
        switch (allowedRoles) {
            case types.USER_ROLE.ADMIN:
                if (user.role !== types.USER_ROLE.ADMIN) {
                    return res.status(403).json({ errors: 'Forbidden: You do not have permission to perform this action.' });
                }
                break;
            case types.USER_ROLE.USER:
                if (user.role !== types.USER_ROLE.USER) {
                    return res.status(403).json({ errors: 'Forbidden: You do not have permission to perform this action.' });
                }
                break;
            case types.USER_ROLE.SELLER:
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