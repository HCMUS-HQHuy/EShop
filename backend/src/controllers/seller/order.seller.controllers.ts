import express from "express";
import { Client } from "pg";

import database from "src/database/index.database";
import { RequestCustom } from "src/types/index.types";
import util from "src/utils/index.utils";

// #### DATABASE FUNCTIONS ####

// #### CONTROLLER FUNCTIONS ####

async function getOrders(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shop_id as number;
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                order_id as "orderId",
                receiver_name as "customer",
                created_at as "date", 
                total_amount as "total", 
                status
            FROM orders
            WHERE shop_id = $1
            ORDER BY created_at DESC
            OFFSET 0 LIMIT ${process.env.PAGINATION_LIMIT || 10}
        `;
        const result = await db.query(sql, [shopId]);
        return res.status(200).json(util.response.success("Seller information retrieved successfully", { orders: result.rows }));
    } catch (error) {
        console.error("Error fetching seller information:", error);
        return res.status(500).json(util.response.internalServerError());
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function getOrderDetails(req: RequestCustom, res: express.Response) {
    if (util.role.isSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError("sellers"));
    }

    const shopId: number = req.user?.shop_id as number;
    const orderId: number = parseInt(req.params.orderId);
    if (isNaN(orderId) || orderId <= 0) {
        return res.status(400).json(util.response.error("Invalid order ID"));
    }

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                orders.order_id as "orderId",
                orders.created_at as "date", 
                orders.status,
                json_build_object(
                    'name', orders.receiver_name,
                    'email', orders.email,
                    'phone', orders.phone_number
                ) as customer,
                orders.street_address as "shippingAddress",
                orders.city as "shippingCity",
                json_build_object(
                    'subtotal', orders.total_amount,
                    'shipping', orders.shipping_fee,
                    'discount', orders.discount_amount,
                    'total', orders.final_amount
                ) as summary,
                payments.payment_method_code as "paymentMethod",
                payments.status as "paymentStatus",
                json_agg(json_build_object(
                    'id', products.product_id,
                    'sku', products.sku,
                    'name', products.name,
                    'imageUrl', products.image_url,
                    'price', order_items.price_at_purchase,
                    'quantity', order_items.quantity,
                    'discount', order_items.discount_at_purchase
                )) as items
            FROM orders
            JOIN payments USING (order_id)
            JOIN order_items USING (order_id)
            JOIN products USING (product_id)
            WHERE orders.shop_id = $1 AND orders.order_id = $2
            GROUP BY 
                orders.order_id, 
                payments.payment_method_code, 
                payments.status, 
                orders.receiver_name,
                orders.email, 
                orders.phone_number,
                orders.street_address, 
                orders.city, 
                orders.total_amount, 
                orders.shipping_fee, 
                orders.discount_amount, 
                orders.final_amount
        `;
        const result = await db.query(sql, [shopId, orderId]);
        if (result.rows.length === 0) {
            return res.status(404).json(util.response.error("Order not found"));
        }
        const orders = result.rows.map((row: any) => ({
            ...row,
            items: row.items.map((item: any) => ({
                ...item,
                imageUrl: `${process.env.PUBLIC_URL}/${item.imageUrl}`,
            })),
        }));
        console.log(order);
        return res.status(200).json(util.response.success("Order details retrieved successfully", { order: orders[0] }));
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json(util.response.internalServerError());
    } finally {
        await database.releaseConnection(db);
    }
}

const order = {
    fetchList: getOrders,
    fetchDetails: getOrderDetails,
};

export default order;
