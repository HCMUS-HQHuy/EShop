import express from "express";
import jwt from "jsonwebtoken";

import utils from "src/utils/index.utils";
import SOCKET_EVENTS from "src/constants/socketEvents";
import prisma from "src/models/prismaClient";

import { RequestCustom } from "src/types/common.types";
import { UserInfor } from "src/types/user.types";
import { USER_STATUS } from "@prisma/client";

async function auth(req: RequestCustom, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) token = req.cookies.auth_jwt;
    if (!token) return res.sendStatus(401);
    try {
        const { userId, role } = jwt.verify(token, process.env.JWT_SECRET as string) as UserInfor;
        req.user = { userId, role } as UserInfor;
        console.log(`Authenticated user: ${req.user.userId}, Role: ${req.user.role}`);
        if (utils.role.isAdmin(req.user)) {
            return next();
        }
    } catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(403).json({ errors: 'Invalid Token.' });
    }

    try {
        const result = await prisma.users.findFirst({
            where: { userId: req.user.userId, status: USER_STATUS.ACTIVE },
            select: { userId: true, username: true, role: true, shops: { select: { shopId: true, status: true } } }
        })
        if (result === null) {
            return res.status(403).json({ errors: 'Forbidden: User not found or inactive.' });
        }
        const infor: UserInfor = result;
        req.user = infor;
        req.io?.emit(SOCKET_EVENTS.LOGIN, 'logged in successfully');
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ errors: 'Internal server error' });
    }
}

// #### EXPORTS ####
export default auth;