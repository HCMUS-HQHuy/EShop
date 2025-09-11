import express from "express";
import { Client } from "pg";

import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";
import database from "src/database/index.database";

import { SOCKET_EVENTS } from "src/constants/socketEvents";
import { UpdateUserStatusRequest, UpdateSellerStatusRequest } from "src/types/index.types";
import { RequestCustom } from "src/types/index.types";
import {SHOP_STATUS, USER_STATUS} from "@prisma/client";
import prisma from "src/models/prismaClient";

// #### DATABASE FUNCTIONS ####

async function checkUserCondition(data: UpdateUserStatusRequest) {
    const errors: Partial<Record<keyof UpdateUserStatusRequest, string>> = {};
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT COUNT(*) FROM users 
            WHERE userId = $1 AND status = $2
        `;
        const status = data.status === USER_STATUS.BANNED ? USER_STATUS.ACTIVE : USER_STATUS.BANNED;
        const result = await db.query(sql, [data.userId, status]);
        if (parseInt(result.rows[0].count, 10) === 0) {
            errors.userId = "User account not found or not banned";
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database validation failed");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

async function updateUserStatus(userId: number, status: USER_STATUS) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE users SET status = $1
            WHERE userId = $2
        `;
        const values = [status, userId];
        await db.query(sql, values);
    } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Database error");
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT u.userId, u.username, s.shopId, s.shop_name, s.status
            FROM users AS u
            LEFT JOIN shops AS s ON u.userId = s.userId
            WHERE s.status = '${SHOP_STATUS.PENDING_VERIFICATION}'
        `;
        const result = await db.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching seller accounts:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// This function handles the review of seller accounts by the admin
// It validates the request data and updates the shop account status in the database
// It updates the shop account status and optionally the rejection reason
async function reviewShop(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }

    // const getInfoShop = {}

    // foreign key -> user -> userId
    // check userId -> shop -> ok?

    //--- 

    // ok -> 

    // const dataConfig = {
    //     userId: getInfoShop.userId,
    //     shopId: getInfoShop.shopId,
    //     status: getInfoShop.status,
    //     admin_note: getInfoShop.admin_note
    // }

    // io.emit(to [room, userId ] -> emmit  eventSOket (access shop / denied shop) -> dataConfig)

    // --- 
// not ok ->


// ======

// client

// socket -> io.on(accessShop)

// function handleAccessshop(data -> dataConfig của event) { 
// check condition -> userId && shopId

// true -> login / reload data -> show access/denied


// }
    // Validate the request body
    const parsedBody = schemas.shop.updateStatus.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.error('Invalid request data', [util.formatError(parsedBody.error)]));
    }
    const data: UpdateSellerStatusRequest = parsedBody.data;

    // update the shop account status in the database
    try {
        const isShopExist = await prisma.shops.findUnique({
            where: { shopId: data.shopId },
            select: { shopId: true }
        });
        if (!isShopExist) {
            return res.status(400).json(util.response.error('Invalid request', ['Shop does not exist']));
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
        return res.status(200).json(util.response.success("Shop account updated", [`shop :${data.shopId}`]));
    } catch (error) {
        console.error("Error updating shop account:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error updating shop account']));
    }
}

// This function handles the review of user accounts by the admin
// It validates the request data and updates the user status in the database
// It updates the user status to either 'Active' or 'Banned'
async function reviewUser(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('Admin'));
    }
    // Validate the request body
    const parsedBody = schemas.user.updateStatus.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.error('Invalid request data', [util.formatError(parsedBody.error)]));
    }
    const data: UpdateUserStatusRequest = parsedBody.data;

    // Check the user condition in the database
    try {
        const conditionCheck = await checkUserCondition(data);
        if (!conditionCheck.valid) {
            return res.status(400).json(util.response.error('Validation error', [conditionCheck.errors]));
        }
    } catch (error) {
        console.error("Error checking user condition:", error);
        return res.status(500).json(util.response.error('Internal server error during condition check', ['Error checking user condition']));
    }

    try {
        await updateUserStatus(data.userId, data.status);
        return res.status(200).json(util.response.success("User account updated", [data.userId]));
    } catch (error) {
        console.error("Error updating user account:", error);
        return res.status(500).json(util.response.error('Internal server error', ['Error updating user account']));
    }
}

const account = {
    reviewShop,
    reviewUser,
    list
}

export default account;