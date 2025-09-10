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

    const parsedBody = schemas.shop.creationRequest.safeParse({
        shop_name: req.body.shopName,
        shop_description: req.body.shopDescription,
        address: req.body.address,
        email: req.body.businessEmail,
        phone_number: req.body.phoneNumber
    });

    if (!parsedBody.success) {
        console.error("Invalid request data:", util.formatError(parsedBody.error));
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const data: ShopCreationRequest = parsedBody.data;
    try {
        await prisma.shops.create({
            data: {
                user_id: req.body.user_id,
                shop_name: data.shop_name,
                shop_description: data.shop_description,
                address: data.address,
                email: data.email,
                phone_number: data.phone_number
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

    const shopId: number = req.user?.shop_id as number;
    try {
        const result = await prisma.shops.findUniqueOrThrow({
            where: { shop_id: shopId },
            select: { shop_name: true, email: true, phone_number: true, shop_description: true, address: true, status: true }
        });
        const shopInfo = {
            name: result.shop_name,
            email: result.email,
            phoneNumber: result.phone_number,
            description: result.shop_description,
            address: result.address,
            status: result.status
        };
        return res.status(200).json(util.response.success("Seller information retrieved successfully", { shopInfo: shopInfo }));
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
