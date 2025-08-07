import express from 'express';
import * as types from '../../types/index.types';
import * as utils from '../../utils/index.utils';
import database from '../../config/db';
import { Client } from 'pg';

// #### DATABASE FUNCTIONS ####

async function getCartItems(userId: number): Promise<types.CartItem[]> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                cart_item_id, user_id, cart_items.product_id, quantity, price
            FROM 
                cart_items
            JOIN 
                products ON cart_items.product_id = products.product_id
            WHERE
                user_id = $1
                AND products.is_deleted = FALSE
                AND products.status = '${types.PRODUCT_STATUS.ACTIVE}'
        `;
        const result = await db.query(sql, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function addProductToCart(cartItem: types.CartItem): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();

        await db.query('BEGIN'); // start transaction

        // 1. Check stock availability
        const checkStockSql = `
            SELECT stock_quantity FROM products 
            WHERE product_id = $1 
            FOR UPDATE
        `;
        // FOR UPDATE to lock the row for update, preventing other transactions from modifying it
        const result = await db.query(checkStockSql, [cartItem.product_id]);

        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }

        const availableStock = result.rows[0].stock_quantity;

        if (availableStock < cartItem.quantity) {
            throw new Error('Not enough stock available');
        }

        // 2. Reduce stock quantity
        const updateStockSql = `
            UPDATE products 
            SET stock_quantity = stock_quantity - $1 
            WHERE product_id = $2
        `;
        await db.query(updateStockSql, [cartItem.quantity, cartItem.product_id]);

        // 3. Add or update product in cart
        const insertCartSql = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        `;
        await db.query(insertCartSql, [cartItem.user_id, cartItem.product_id, cartItem.quantity]);

        await db.query('COMMIT'); // Confirm transaction

    } catch (error) {
        if (db) await db.query('ROLLBACK'); // Rollback if error occurs
        console.error('Error adding product to cart:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}


// #### CONTROLLER FUNCTIONS ####
async function get(req: types.RequestCustom, res: express.Response) {
    if (!utils.isUser(req)) {
        return res.status(403).json({ error: 'Forbidden: Only users can add products to cart' });
    }
    try {
        const userId = req.user?.user_id;
        const cartItems = await getCartItems(userId as number);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addProduct(req: types.RequestCustom, res: express.Response) {
    if (!utils.isUser(req)) {
        return res.status(403).json({ error: 'Forbidden: Only users can add products to cart' });
    }

    const parsedBody = types.CartSchemas.cartItem.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
    }
    const cartItem: types.CartItem = parsedBody.data;
    try {
        await addProductToCart(cartItem);
        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// #### EXPORTS ####
const cart = {
    get,
    addProduct
}
export default cart;