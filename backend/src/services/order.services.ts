import { Job, Queue, Worker } from "bullmq";
import * as types from "types/index.types";
import { Client } from "pg";
import database from "config/db";
import socket from "services/socket.services";

const redis_config = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379)
};

async function checkAndLockOrderItems(items: types.ItemInCart[], db: Client): Promise<types.OrderItemRequest[]> {
    try {
        // Check existing of a cart item and gurantee its record doesn't change
        const sql = `
            WITH cart_data AS (
                SELECT 
                    unnest($1::int[]) AS product_id,
                    unnest($2::int[]) AS quantity
            )
            SELECT
                p.product_id,
                c.quantity,
                p.price AS price_at_purchase
            FROM
                cart_data c
            JOIN
                products p ON p.product_id = c.product_id
            WHERE
                p.status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND p.stock_quantity >= c.quantity
            FOR UPDATE OF p;
        `;
        const productIds = items.map(item => item.product_id);
        const quantities = items.map(item => item.quantity);
        const result = await db.query(sql, [productIds, quantities]);
        if (result.rows.length !== items.length) {
            throw new Error("Invalid order items: One or more items are out of stock, inactive, or do not exist.");
        }
        const order_item: types.OrderItemRequest[] = result.rows;
        return order_item;
    } catch(error) {
        console.error('Error checking order items:', error);
        throw error;
    }
}

async function reduceStockQuantities(orderItems: types.OrderItemRequest[], db: Client): Promise<void> {
    console.log(`Reducing stock for ${orderItems.length} products...`);
    // Dùng CASE để cập nhật nhiều hàng với các giá trị khác nhau trong một câu lệnh
    const sql = `
        UPDATE products
        SET stock_quantity = stock_quantity - data.quantity
        FROM (
            SELECT unnest($1::int[]) as product_id, unnest($2::int[]) as quantity
        ) AS data
        WHERE products.product_id = data.product_id;
    `;

    const productIds = orderItems.map(item => item.product_id);
    const quantities = orderItems.map(item => item.quantity);

    const result = await db.query(sql, [productIds, quantities]);
    if (result.rowCount !== orderItems.length) {
        throw new Error("Concurrency error: Failed to update stock for all items. Please try again.");
    }
    console.log("Stock quantities reduced.");
}

async function insertOrderItems(orderId: number, orderItems: types.OrderItemRequest[], db: Client): Promise<void> {
    console.log(`Inserting ${orderItems.length} items for order ${orderId}...`);
    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        SELECT $1, product_id, quantity, price_at_purchase
        FROM UNNEST(
            $2::int[],      -- product_ids
            $3::int[],      -- quantities
            $4::decimal[]   -- prices
        ) AS t(product_id, quantity, price_at_purchase)
    `;

    const productIds = orderItems.map(item => item.product_id);
    const quantities = orderItems.map(item => item.quantity);
    const prices = orderItems.map(item => item.price_at_purchase);

    await db.query(sql, [orderId, productIds, quantities, prices]);
    console.log("All order items inserted.");
}

async function processOrder(job: Job<types.CreatingOrderRequest>) {
    const orderData: types.CreatingOrderRequest = job.data;
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query('BEGIN');
        const itemsInCart: types.ItemInCart[] = orderData.items;
        const orderItems: types.OrderItemRequest[] = await checkAndLockOrderItems(itemsInCart, db);

        if(!orderItems || !Array.isArray(orderItems)) {
            throw Error;
        }

        const sql_create_order = `
            INSERT INTO orders (user_id, receiver_name, shipping_address, phone_number, email, total_amount, payment_method_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING order_id
        `;
        orderData.total_amount = orderItems.reduce((sum, cur) => sum + (cur.quantity as number * cur.price_at_purchase), 0)
        const orderParams = [
            orderData.user_id,
            orderData.receiver_name,
            orderData.shipping_address,
            orderData.phone_number,
            orderData.email,
            orderData.total_amount,
            orderData.payment_method_id,
            orderData.order_at
        ];

        const orderResult = await db.query(sql_create_order, orderParams);
        if (!orderResult.rows.length) {
            throw new Error("Failed to create order");
        }
        const order_id = orderResult.rows[0].order_id;
        await insertOrderItems(order_id, orderItems, db);
        await reduceStockQuantities(orderItems, db);
        await db.query(`COMMIT`);
        console.log(`Order ${orderData.user_id} created with items:`, orderData.items);
    } catch (error) {
        if (db) {
            await db.query('ROLLBACK');
        }
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

const orderQueue = new Queue("orderQueue", {connection: redis_config});
const orderWorker = new Worker("orderQueue", processOrder, { connection: redis_config });

orderWorker.on('completed', (job: Job) => {
    socket.sendMessageToUser(job.data.user_id, "order", "your order has completed!");
    console.log(`${job.id} has completed!`);
});

orderWorker.on('failed', (job: Job | undefined, err: Error) => {
    if (job) {
        console.log(`${job.id} has failed with ${err.message}`);
        socket.sendMessageToUser(job.data.user_id, "order", "your order has failed!");
    } else {
        console.log(`A job has failed with ${err.message}`);
    }
});

async function create(orderData: types.CreatingOrderRequest) {
    try {
        const hoursAgo = Math.floor((Date.now() - new Date(orderData.order_at).getTime()) / 360000);
        const priority = Math.max(0, Math.min(1000 - hoursAgo, 1000));
        const job = await orderQueue.add("createOrder", orderData, {
            priority: priority
        });
        console.log(`Order job added with ID: ${job.id}`);
        return job.id;
    } catch (error) {
        console.error("Error adding order job:", error);
        throw error;
    }
}

const order = {
    create
};

export default order;