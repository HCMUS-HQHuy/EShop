import { Request, Response, NextFunction } from 'express';
import * as types from '../types/index.types';

export const checkRole = (allowedRoles: types.Role[]) => {
    return (req: types.RequestCustom, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (user.role === types.Role.Admin)
            return next();

        if (!allowedRoles.includes(user.role as types.Role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }
        next();
    };
};