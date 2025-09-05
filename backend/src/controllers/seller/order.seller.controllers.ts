import express from "express";
import { Client } from "pg";

import database from "database/index.database";
import { RequestCustom } from "types/index.types";
import util from "utils/index.utils";

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
                users.username as "customer", 
                orders.created_at as "date", 
                total_amount as "total", 
                orders.status
            FROM orders JOIN users USING(user_id)
            WHERE shop_id = $1
            ORDER BY orders.created_at DESC
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

const order = {
    fetchList: getOrders,
};

export default order;
