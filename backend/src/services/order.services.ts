import { Job, Queue, Worker } from "bullmq";
import IORedis from "ioredis";

import services from "./index.services";
import { generateCode } from "src/utils/gencode.utils";
import util from "src/utils/index.utils";
import SOCKET_EVENTS from "src/constants/socketEvents";
import { PRODUCT_STATUS } from "@prisma/client";
import { CreatingOrderRequest } from "src/types/order.types";
import prisma from "src/models/prismaClient";

const redis_config = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
});

async function processOrder(job: Job<{ orderData: CreatingOrderRequest, userId: number }>) {
    const { orderData, userId } = job.data;
    try {
        return await prisma.$transaction(async (tx) => {
            const orderItems = await tx.products.findMany({
                where: {
                    productId: { in: orderData.items.map(item => item.productId) },
                    status: PRODUCT_STATUS.ACTIVE
                },
                select: {
                    productId: true,
                    price: true,
                    discount: true,
                    stockQuantity: true
                }
            });
            for (const item of orderData.items) {
                const product = orderItems.find(p => p.productId === item.productId);
                if (!product || product.stockQuantity < item.quantity) {
                    throw new Error(`Product ${item.productId} is out of stock or inactive.`);
                }
            }
            const orderCode = generateCode(String(userId));
            const total: number = orderData.items.reduce((sum, item) => {
                const product = orderItems.find(p => p.productId === item.productId);
                const priceAtPurchase = product ? Number(product.price) : 0;
                const discountAtPurchase = product ? Number(product.discount) : 0;
                return sum + (priceAtPurchase * item.quantity * (100 - discountAtPurchase) / 100);
            }, 0);
            const discount: number = orderData.items.reduce((sum, item) => {
                const product = orderItems.find(p => p.productId === item.productId);
                const priceAtPurchase = product ? Number(product.price) : 0;
                const discountAtPurchase = product ? Number(product.discount) : 0;
                return sum + (priceAtPurchase * item.quantity * discountAtPurchase / 100);
            }, 0);
            const finalAmount = total - discount;

            const { orderId, orderItems: createdOrderItems } = await tx.orders.create({
                data: {
                    userId: userId,
                    shopId: orderData.shopId,
                    receiverName: orderData.receiverName,
                    shippingAddress: orderData.shippingAddress,
                    phoneNumber: orderData.phoneNumber,
                    email: orderData.email,
                    total: orderData.items.reduce((sum, item) => {
                        const product = orderItems.find(p => p.productId === item.productId);
                        const priceAtPurchase = product ? Number(product.price) : 0;
                        const discountAtPurchase = product ? Number(product.discount) : 0;
                        return sum + (priceAtPurchase * item.quantity * (100 - discountAtPurchase) / 100);
                    }, 0),
                    shippingFee: 0,
                    discount: discount,
                    final: finalAmount,
                    createdAt: new Date(orderData.orderAt),
                    orderItems: {
                        createMany: {
                            data: orderItems.map(product => ({
                                productId: product.productId,
                                price: product.price,
                                discount: product.discount, 
                                quantity: orderData.items.find(item => item.productId === product.productId)?.quantity || 0
                            }))
                        }
                    }
                },
                select: { orderId: true, orderItems: true }
            });
            console.log("Order created with ID:", orderId, "and items:", createdOrderItems, orderData.items);
            if (orderId === null) {
                throw new Error("Failed to create order.");
            }
            await Promise.all(orderData.items.map(item =>
                tx.products.update({
                    where: {
                        productId: item.productId,
                        status: PRODUCT_STATUS.ACTIVE
                    },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity
                        }
                    }
                })
            ));
            const paymentInfo = await services.payment.create(orderCode, finalAmount, orderData.paymentMethodCode);
            if (!paymentInfo) {
                throw new Error("Failed to initiate payment.");
            }
            await tx.payments.create({
                data: {
                    paymentCode: paymentInfo.paymentCode,
                    orderId: orderId,
                    paymentMethodCode: orderData.paymentMethodCode,
                    amount: paymentInfo.amount,
                }
            });
            return util
                .response
                .success("Order created successfully", {
                    isRedirect: paymentInfo.redirect,
                    url: paymentInfo.url
                });
        });
    } catch (error) {
        throw error;
    }
}

const orderQueue = new Queue("orderQueue", { connection: redis_config });
const orderWorker = new Worker("orderQueue", processOrder, { connection: redis_config });

orderWorker.on('completed', (job: Job) => {
    const response = job.returnvalue;
    console.log(`${job.id} has completed! and return value: `, response);
    services.socket.sendMessageToUser(job.data.userId, SOCKET_EVENTS.REDIRECT, response);
});

orderWorker.on('failed', (job: Job | undefined, err: Error) => {
    if (job) {
        services.socket.sendMessageToUser(job.data.userId, "order", err.message);
        console.log(`${job.id} has failed with ${err.message}`);
    } else {
        console.log(`A job has failed with ${err.message}`);
    }
});

async function create(userId: number, orderData: CreatingOrderRequest) {
    try {
        const hoursAgo = Math.floor((Date.now() - new Date(orderData.orderAt).getTime()) / 360000);
        const priority = Math.max(0, Math.min(1000 - hoursAgo, 1000));
        const job = await orderQueue.add("createOrder", { orderData, userId }, {
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