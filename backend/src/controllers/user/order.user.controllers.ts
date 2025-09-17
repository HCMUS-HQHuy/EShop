import express from "express";
import services from "src/services/index.services";
import { RequestCustom, CreatingOrderRequest } from "src/types/index.types";
import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";
import prisma from "src/models/prismaClient";

// #### ORDER CONTROLLER ####

async function create(req: RequestCustom, res: express.Response) {
    if (!util.role.isUser(req.user)) {
        return res.status(403).json(util.response.authorError('users'));
    }
    console.log(req.body);
    const parsedBody = schemas.order.creating.safeParse({
        ...req.body
    });
    if (!parsedBody.success) {
        return res
            .status(400)
            .json(util.response.zodValidationError(parsedBody.error));
    }
    const orderData: CreatingOrderRequest = parsedBody.data;

    try {
        await services.order.create(req.user?.userId!, orderData);
        return res
            .status(201)
            .json(util.response.success("Order created successfully. Please wait a moment for the system to confirm."));
    } catch (error) {
        return res
            .status(500)
            .json(util.response.internalServerError());
    }
}

async function getAllOrders(req: RequestCustom, res: express.Response) {
    if (!util.role.isUser(req.user)) {
        return res.status(403).json(util.response.authorError('users'));
    }
    const userId = req.user!.userId;
    try {
        const orders = await prisma.orders.findMany({
            where: { userId: userId },
            select: {
                orderId: true,
                shopId: true,
                total: true,
                shippingFee: true,
                discount: true,
                createdAt: true,
                final: true,
                status: true,
                email: true,
                receiverName: true,
                shippingAddress: true,
                phoneNumber: true,
                orderItems: { select: { product: { select: { productId: true, name: true, imageUrl: true } }, quantity: true, price: true, discount: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return res
            .status(200)
            .json(util.response.success("Orders retrieved successfully", {orders}));
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res
            .status(500)
            .json(util.response.internalServerError());
    }
}

// #### EXPORTS ####
const order = {
    create,
    getAllOrders
};
export default order;
