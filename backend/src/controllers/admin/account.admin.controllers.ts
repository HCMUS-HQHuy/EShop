import express from "express";
import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";

import { SOCKET_EVENTS } from "src/constants/socketEvents";
import { UpdateUserStatusRequest, UpdateSellerStatusRequest } from "src/types/index.types";
import { RequestCustom } from "src/types/index.types";
import {SHOP_STATUS} from "@prisma/client";
import prisma from "src/models/prismaClient";

// #### CONTROLLER FUNCTIONS ####

async function list(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    try {
        const result = await prisma.users.findMany({
            where: {
                shop: {status: SHOP_STATUS.PENDING_VERIFICATION}
            },
            select: {
                userId: true,
                username: true,
                shop: { select: { shopId: true, shopName: true, status: true } }
            }
        })
        return res.status(200).json(util.response.success("Seller accounts fetched", {result}));
    } catch (error) {
        console.error("Error fetching seller accounts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function reviewShop(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    const parsedBody = schemas.shop.updateStatus.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const data: UpdateSellerStatusRequest = parsedBody.data;

    try {
        const isShopExist = await prisma.shops.findUnique({
            where: { shopId: data.shopId },
            select: { shopId: true }
        });
        if (!isShopExist) {
            return res.status(400).json(util.response.error('Invalid request'));
        }

        const responseData = await prisma.shops.update({
            where: { shopId: data.shopId },
            data: { status: data.status, adminNote: data.adminNote },
            select: { status: true, adminNote: true }
        })
        console.log('responsedata: ', responseData,);

        const io = req?.io;
        if (io === undefined) 
            throw Error("Socket IO instance is not available");
        io.to(`user_room_${data.userId}`).emit(SOCKET_EVENTS.SET_SHOP_STATUS, responseData);
        return res.status(200).json(util.response.success("Shop account updated"));
    } catch (error) {
        console.error("Error updating shop account:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error updating shop account']));
    }
}

async function reviewUser(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    // Validate the request body
    const parsedBody = schemas.user.updateStatus.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const data: UpdateUserStatusRequest = parsedBody.data;

    // Check the user condition in the database
    try {
        const user = await prisma.users.findUnique({
            where: { userId: data.userId },
            select: { status: true }
        });
        if (user === null) {
            return res.status(400).json(util.response.error('Validation error'));
        }
    } catch (error) {
        console.error("Error checking user condition:", error);
        return res.status(500).json(util.response.internalServerError());
    }

    try {
        await prisma.users.update({
            where: { userId: data.userId },
            data: { status: data.status }
        })
        return res.status(200).json(util.response.success("User account updated"));
    } catch (error) {
        console.error("Error updating user account:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

const account = {
    reviewShop,
    reviewUser,
    list
}

export default account;