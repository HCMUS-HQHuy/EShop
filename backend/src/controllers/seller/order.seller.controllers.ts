import express from "express";
import { PAGINATION_LIMIT } from "src/constants/globalVariables";
import prisma from "src/models/prismaClient";
import { RequestCustom } from "src/types/index.types";
import util from "src/utils/index.utils";

// #### DATABASE FUNCTIONS ####

// #### CONTROLLER FUNCTIONS ####

async function getOrders(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shop?.shopId as number;
    try {
        const orders = await prisma.orders.findMany({
            where: { shopId: shopId },
            select: {
                orderId: true,
                receiverName: true,
                createdAt: true,
                total: true,
                status: true
            },
            orderBy: { createdAt: 'desc' },
            take: PAGINATION_LIMIT
        });
        return res.status(200).json(util.response.success("Seller information retrieved successfully", { orders }));
    } catch (error) {
        console.error("Error fetching seller information:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

async function getOrderDetails(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shop?.shopId as number;
    const orderId: number = parseInt(req.params.orderId);
    if (isNaN(orderId) || orderId <= 0) {
        return res.status(400).json(util.response.error("Invalid order ID"));
    }
    try {
        const order = prisma.orders.findFirst({
            where: { orderId: orderId, shopId: shopId },
            select: {
                orderId: true, 
                status: true, 
                createdAt: true, 
                total: true,
                shippingFee: true, 
                discount: true, 
                final: true, 
                receiverName: true, 
                email: true, 
                phoneNumber: true, 
                shippingAddress: true, 
                payments: { select: { paymentMethodCode: true, status: true } }, 
                orderItems: { select: { productId: true, product: true, discount: true, price: true, quantity: true } }
            }
        });
        if (order === null) {
            return res.status(404).json(util.response.error("Order not found"));
        }
        console.log(order);
        return res.status(200).json(util.response.success("Order details retrieved successfully", { order }));
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json(util.response.internalServerError());
    }
}

const order = {
    fetchList: getOrders,
    fetchDetails: getOrderDetails,
};

export default order;
