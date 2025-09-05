import express from "express";
import { Client } from "pg";
import services from "services/index.services";
import database from "database/index.database";
import { OrderType, RequestCustom } from "types/index.types";
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
            SELECT order_id as "orderId", created_at as "orderAt", shop_id as "shopId",
                   total_amount as "totalAmount", shipping_fee as "shippingFee",
                   discount_amount as "discountOrder", status,
                   receiver_name as "name", street_address as "address", phone_number as "phone"
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC
            OFFSET 0 LIMIT 20
        `;
        const result = await db.query(sql, [userId]);
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json(util.response.error("No orders found for this user."));
        }
        const orders: OrderType[] = result.rows.map((row) => ({
            orderId: row.orderId,
            shopId: row.shopId,
            totalAmount: row.totalAmount,
            shippingFee: row.shippingFee,
            tax: 0,
            discount: row.discountOrder,
            orderDate: row.orderAt,
            status: row.status,
            customerInfo: {
                name: row.name,
                address: row.address,
                phone: row.phone,
            },
            products: []
        }));
        for (const order of orders) {
            const itemsSql = `
                SELECT
                    oi.product_id as "productId", 
                    p.name as "name", 
                    p.image_url as "imageUrl",
                    oi.quantity, 
                    oi.price_at_purchase as "unitPrice",
                    oi.discount_at_purchase as "discountAtPurchase"
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = $1
            `;
            const itemsResult = await db.query(itemsSql, [order.orderId]);
            order.products = itemsResult.rows.map((itemRow) => ({
                productId: itemRow.productId,
                name: itemRow.name,
                image: `${process.env.PUBLIC_URL}/${itemRow.imageUrl}`,
                quantity: itemRow.quantity,
                price: itemRow.unitPrice,
                subtotal: itemRow.unitPrice * itemRow.quantity * (100 - itemRow.discountAtPurchase) / 100,
            }));
        }
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
