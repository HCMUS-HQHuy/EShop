import { Job, Queue, Worker } from "bullmq";
import * as types from "types/index.types";
import { Client } from "pg";

import services from "./index.services";
import database from "database/index.database";
import { generateCode } from "utils/gencode.utils";
import { PAYMENT_METHOD } from "types/index.types";
import util from "utils/index.utils";
import SOCKET_EVENTS from "constants/socketEvents";

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
                p.price * (100 - p.discount) / 100 AS price_after_discount
            FROM
                cart_data c
            JOIN
                products p ON p.product_id = c.product_id
            WHERE
                p.status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND p.stock_quantity >= c.quantity
            FOR UPDATE OF p;
        `;
        const productIds = items.map(item => item.productId);
        const quantities = items.map(item => item.quantity);
        const result = await db.query(sql, [productIds, quantities]);
        if (result.rows.length !== items.length) {
            throw new Error("Invalid order items: One or more items are out of stock, inactive, or do not exist.");
        }
        const order_item: types.OrderItemRequest[] = result.rows.map(row => ({
            orderId: 0, // placeholder, will be set when inserting order
            productId: row.product_id,
            quantity: row.quantity,
            priceAtPurchase: row.price_after_discount
        }));
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

    const productIds = orderItems.map(item => item.productId);
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

    const productIds = orderItems.map(item => item.productId);
    const quantities = orderItems.map(item => item.quantity);
    const prices = orderItems.map(item => item.priceAtPurchase);
    console.log("Inserting order items with params:", [orderId, productIds, quantities, prices]);
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
        const sqlCreateOrder = `
            INSERT INTO orders (
                user_id, 
                shop_id,
                receiver_name, 
                street_address, 
                city, 
                phone_number, 
                email, 
                total_amount, 
                shipping_fee,
                final_amount,
                created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING order_id
        `;
        const orderCode = generateCode(String(orderData.userId));
        orderData.items = orderItems;
        orderData.totalAmount = orderItems.reduce((sum, cur) => sum + (cur.quantity as number * cur.priceAtPurchase), 0);
        const orderParams = [
            orderData.userId,
            orderData.shopId,
            orderData.receiverName,
            orderData.streetAddress,
            orderData.city,
            orderData.phoneNumber,
            orderData.email,
            orderData.totalAmount,
            orderData.shippingFee,
            orderData.finalAmount,
            orderData.orderAt
        ];

        const orderResult = await db.query(sqlCreateOrder, orderParams);
        if (!orderResult.rows.length) {
            throw new Error("Failed to create order");
        }
        const orderId = orderResult.rows[0].order_id;
        await insertOrderItems(orderId, orderItems, db);
        await reduceStockQuantities(orderItems, db);
        const paymentInfo = await services.payment.create(orderCode, orderData);
        const sqlCreatePayment = `
            INSERT INTO payments (payment_code, order_id, payment_method_code, amount)
            VALUES ($1, $2, $3, $4)
        `;
        await db.query(sqlCreatePayment, [paymentInfo.paymentCode, orderId, paymentInfo.paymentMethodCode, paymentInfo.amount]);
        await db.query(`COMMIT`);
        console.log(`Order ${orderData.userId} created with items:`, orderData.items);
        return util
            .response
            .success("Order created successfully", [{
                isRedirect: paymentInfo.redirect,
                url: paymentInfo.url
            }]);
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
    const response = job.returnvalue;
    console.log(`${job.id} has completed! and return value: `, response);
    services.socket.sendMessageToUser(job.data.userId, SOCKET_EVENTS.REDIRECT, response);
});

// đoạn này cần xử lý thêm gì khi nó failed không? vì vẫn có TH nó failed nhưng không biết nó là từ job nào ?
orderWorker.on('failed', (job: Job | undefined, err: Error) => {
    if (job) {
        services.socket.sendMessageToUser(job.data.userId, "order", err.message);
        console.log(`${job.id} has failed with ${err.message}`);
    } else {
        console.log(`A job has failed with ${err.message}`);
    }
});

async function create(orderData: types.CreatingOrderRequest) {
    try {
        const hoursAgo = Math.floor((Date.now() - new Date(orderData.orderAt).getTime()) / 360000);
        const priority = Math.max(0, Math.min(1000 - hoursAgo, 1000));
        const job = await orderQueue.add("createOrder", orderData, {
            priority: priority,
            attempts: 1, // attempts 3 có vẻ không hợp lý vì log lại user quá nhiều lần ! làm sao để xủ lý.
            // backoff: {
            //     type: 'exponential',
            //     delay: 5000
            // },
            removeOnComplete: true,
            removeOnFail: false
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