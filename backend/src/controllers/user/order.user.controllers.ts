import express from "express";
import { Client } from "pg";
import services from "services/index.services";
import database from "database/index.database";
import { RequestCustom } from "types/index.types";
import { OrderSchema, CreatingOrderRequest } from "types/index.types";
import util from "utils/index.utils";

// #### ORDER CONTROLLER ####

async function create(req: RequestCustom, res: express.Response) {
    if (!util.role.isUser(req.user)) {
        return res.status(403).json(util.response.authorError('users'));
    }
    console.log(req.body);
    const parsedBody = OrderSchema.creating.safeParse({
        ...req.body,
        userId: req.user?.user_id
    });
    if (!parsedBody.success) {
        return res
            .status(400)
            .json(util.response.zodValidationError(parsedBody.error));
    }
    const orderData: CreatingOrderRequest = parsedBody.data;

    try {
        await services.order.create(orderData);
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
    const userId = req.user!.user_id;
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            WITH order_ids AS (
                SELECT order_id, created_at
                FROM orders
                WHERE user_id = $1
                ORDER BY created_at DESC
                OFFSET 0 LIMIT 20
            )
            SELECT o.order_id, o.shop_id, o.total_amount, o.shipping_fee, o.final_amount, o.status, o.created_at,
                p.product_id, p.name, p.image_url, oi.quantity, oi.price_at_purchase
            FROM orders o
            JOIN order_items oi USING(order_id)
            JOIN products p USING(product_id)
            WHERE o.order_id IN (SELECT order_id FROM order_ids)
            ORDER BY o.created_at DESC;
        `;
        const result = await db.query(sql, [userId]);
        const orders = result.rows.map(row => ({
            orderId: row.order_id,
            shopId: row.shop_id,
            name: row.name,
            price: row.price_at_purchase,
            afterDiscount: row.price_at_purchase,
            img: `${process.env.PUBLIC_URL}/${row.image_url}`,
            quantity: row.quantity,
            status: row.status,
            orderAt: null
        }));
        return res
            .status(200)
            .json(util.response.success("Orders retrieved successfully", {orders}));
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res
            .status(500)
            .json(util.response.internalServerError());
    } finally {
        await database.releaseConnection(db);
    }
}

// #### EXPORTS ####
const order = {
    create,
    getAllOrders
};
export default order;
