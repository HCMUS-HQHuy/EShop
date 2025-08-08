import { Job, Queue, Worker } from "bullmq";
import * as types from "../types/index.types";
import { Client } from "pg";
import database from "../config/db";

const redis_config = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379)
};

async function checkAndLockOrderItems(cart_items_id: number[], user_id: number, db: Client): Promise<types.OrderItemRequest[]> {
    try {
        // Check existing of a cart item and gurantee its record doesn't change
        const sql = `
            SELECT
                cart_items.product_id,
                cart_items.quantity,
                products.price as price_at_purchase
            FROM
                cart_items
            JOIN 
                products ON cart_items.product_id = products.product_id
            WHERE
                cart_items.cart_item_id = ANY($1::int[])
                AND cart_items.user_id = $2
                AND products.status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND products.stock_quantity >= cart_items.quantity
            FOR UPDATE OF products;
        `;
        const result = await db.query(sql, [cart_items_id, user_id]);
        if (result.rows.length !== cart_items_id.length) {
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

async function removeItemsFromCart(itemIds: number[], user_id: number, db: Client): Promise<void> {
    try {
        const sql_remove = `
            DELETE FROM cart_items
            WHERE cart_item_id = ANY($1) AND user_id = $2
        `;
        await db.query(sql_remove, [itemIds, user_id]);
    } catch (error) {
        console.error('Error removing items from cart:', error);
        throw error;
    }
}

async function processOrder(job: Job<types.CreatingOrderRequest>) {
    const orderData: types.CreatingOrderRequest = job.data;
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query('BEGIN');

        const orderItems: types.OrderItemRequest[] = await checkAndLockOrderItems(orderData.items, orderData.user_id, db);

        if(!orderItems || !Array.isArray(orderItems)) {
            throw Error
        }

        const sql_create_order = `
            INSERT INTO orders (user_id, receiver_name, shipping_address, phone_number, email, total_amount, payment_method_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
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
            orderData.payment_method_id
        ];

        const orderResult = await db.query(sql_create_order, orderParams);
        if (!orderResult.rows.length) {
            throw new Error("Failed to create order");
        }
        const order_id = orderResult.rows[0].order_id;
        await insertOrderItems(order_id, orderItems, db);
        await reduceStockQuantities(orderItems, db);
        await removeItemsFromCart(orderData.items, orderData.user_id, db);
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
    // add socket handling here for real-time updates
    console.log(`${job.id} has completed!`);
});

orderWorker.on('failed', (job: Job | undefined, err: Error) => {
    // add socket handling here for real-time updates
    if (job) {
        console.log(`${job.id} has failed with ${err.message}`);
    } else {
        console.log(`A job has failed with ${err.message}`);
    }
});

async function create(orderData: types.CreatingOrderRequest) {
    try {
        console.log("Adding order job to queue with data:", orderData);
        const job = await orderQueue.add("createOrder", orderData);
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