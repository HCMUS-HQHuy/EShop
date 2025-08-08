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
                cart_item_id, user_id, cart_items.product_id, 
                quantity, products.name AS product_name, 
                products.image_url AS product_image, price,
                products.description AS product_description,
                products.stock_quantity AS product_stock
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
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query('BEGIN');
        // 1. Check stock availability
        const checkStockSql = `
            SELECT stock_quantity FROM products 
            WHERE product_id = $1 
            FOR UPDATE
        `;
        // FOR UPDATE to lock the row for update, preventing other transactions from modifying it
        const result = await db.query(checkStockSql, [cartItem.product_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const availableStock = result.rows[0].stock_quantity;
        const currentCartSql = `            
            SELECT quantity FROM cart_items 
            WHERE user_id = $1 AND product_id = $2
            FOR UPDATE
        `;
        const currentCartResult = await db.query(currentCartSql, [cartItem.user_id, cartItem.product_id]);
        const currentQuantity = currentCartResult.rows.length > 0 ? currentCartResult.rows[0].quantity : 0;
        
        const totalQuantity = currentQuantity + cartItem.quantity;
        if (availableStock < totalQuantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // 2. Add or update product in cart
        const insertCartSql = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        `;
        await db.query(insertCartSql, [cartItem.user_id, cartItem.product_id, cartItem.quantity]);
        
        await db.query('COMMIT'); // Confirm transaction
        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        if (db) await db.query('ROLLBACK'); // Rollback if error occurs
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function removeProduct(req: types.RequestCustom, res: express.Response) {
    // Ensure the user is authenticated and has the right permissions
    if (!utils.isUser(req)) {
        return res.status(403).json({ error: 'Forbidden: Only users can remove products from cart' });
    }
    // Validate the cart item ID from the request parameters
    const cartItemId = parseInt(req.params.id, 10);
    const userId = req.user?.user_id;
    if (isNaN(cartItemId)) {
        return res.status(400).json({ error: 'Invalid cart item ID' });
    }
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query('BEGIN');

        // Find data to be deleted
        const findSql = `
            SELECT * FROM cart_items
            WHERE cart_item_id = $1 AND user_id = $2
        `;
        const findResult = await db.query(findSql, [cartItemId, userId]);
        // If no data found, rollback and return error
        if (findResult.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: 'Cart item not found' });
        }
        // Proceed to delete the cart item
        const sql = `
            DELETE FROM cart_items 
            WHERE cart_item_id = $1 AND user_id = $2
        `;
        await db.query(sql, [cartItemId, userId]);
        // Commit the transaction
        await db.query('COMMIT');
        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        if (db) await db.query('ROLLBACK');
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// allow users to update a product and quantity of the product in their cart
async function updateProduct(req: types.RequestCustom, res: express.Response) {
    if (!utils.isUser(req)) {
        return res.status(403).json({ error: 'Forbidden: Only users can update products in cart' });
    }
    const cartItemId = parseInt(req.params.id, 10);
    if (isNaN(cartItemId)) {
        return res.status(400).json({ error: 'Invalid cart item ID' });
    }

    const parsedBody = types.CartSchemas.cartItem.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
    }
    const cartItem: types.CartItem = parsedBody.data;

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        await db.query('BEGIN');
        // Check if the cart item exists
        const checkSql = `
            SELECT * FROM cart_items 
            WHERE cart_item_id = $1 AND user_id = $2
        `;
        const checkResult = await db.query(checkSql, [cartItemId, req.user?.user_id]);
        if (checkResult.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Check stock availability
        const stockSql = `
            SELECT stock_quantity FROM products 
            WHERE product_id = $1
        `;
        const stockResult = await db.query(stockSql, [cartItem.product_id]);
        if (stockResult.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: 'Product not found' });
        }
        const availableStock = stockResult.rows[0].stock_quantity;
        if (cartItem.quantity > availableStock) {
            await db.query('ROLLBACK');
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Update the cart item
        const sql = `
            UPDATE cart_items
            SET quantity = $1, product_id = $2
            WHERE cart_item_id = $3 AND user_id = $4
        `;
        await db.query(sql, [cartItem.quantity, cartItem.product_id, cartItemId, req.user?.user_id]);

        await db.query('COMMIT');
        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        if (db) await db.query('ROLLBACK');
        console.error('Error updating product in cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### EXPORTS ####
const cart = {
    get,
    addProduct,
    updateProduct,
    removeProduct
}
export default cart;