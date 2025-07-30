import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (user.role === 'Admin')
            return next(); // Admins can access all routes

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }
        next();
    };
};