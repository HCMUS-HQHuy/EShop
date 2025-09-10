import express from "express";
import prisma from "src/models/prismaClient";

import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";

import { ShopCreationRequest, RequestCustom } from "src/types/index.types";

// #### CONTROLLER FUNCTIONS ####
async function create(req: RequestCustom, res: express.Response) {
    if (util.role.isUser(req.user) === false) {
        return res.status(403).json(util.response.authorError('users'));
    }
    if (util.role.isSeller(req.user)) {
        return res.status(403).json(util.response.error('Sellers cannot create twice seller account.'));
    }

    const parsedBody = schemas.shop.creationRequest.safeParse(req.body);

    if (!parsedBody.success) {
        console.error("Invalid request data:", util.formatError(parsedBody.error));
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const data: ShopCreationRequest = parsedBody.data;
    try {
        await prisma.shops.create({
            data: {
                userId: req.body.userId,
                ...data
            }
        })
        return res.status(201).json(util.response.success("Seller account created successfully"));
    } catch (error) {
        console.error("Error creating seller account:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function getInformation(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shopId as number;
    try {
        const shopInfo = await prisma.shops.findUniqueOrThrow({
            where: { shopId: shopId },
            select: { shopName: true, email: true, phoneNumber: true, shopDescription: true, address: true, status: true }
        });
        return res.status(200).json(util.response.success("Seller information retrieved successfully", { shopInfo }));
    } catch (error) {
        console.error("Error fetching seller information:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

const sellerAccountController = {
    create,
    getInformation
};

export default sellerAccountController;
