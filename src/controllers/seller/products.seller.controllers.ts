import express from 'express';
import { Client } from 'pg';
import database from '../../config/db';
import * as utils from '../../utils/index.utils';
import * as types from '../../types/index.types';

// #### DATABASE FUNCTIONS ####

async function checkProductExists(productId: number, status?: types.ProductStatus): Promise<boolean> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT COUNT(*)
            FROM products
            WHERE product_id = $1 AND is_deleted = FALSE
                AND ($2::text IS NULL OR status = $2)
        `;
        const result = await db.query(sql, [productId, status]);
        return result.rows[0].count > 0;
    } catch (error) {
        console.error('Error checking product existence:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function removeProduct(userId: number, productId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET is_deleted = TRUE, deleted_at = NOW(), deleted_by = $1
            WHERE product_id = $2
        `;
        await db.query(sql, [userId, productId]);
    } catch (error) {
        console.error('Error removing product:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function updateProduct(productId: number, product: types.ProductAddRequest): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET name = $1, price = $2, stock_quantity = $3, shop_id = $4, 
                status = '${types.PRODUCT_STATUS.PENDING}'
            WHERE product_id = $5 AND is_deleted = FALSE
        `;
        const data = [product.name, product.price, product.stock_quantity, product.shop_id, productId];
        await db.query(sql, data);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function listProducts(shop_id: number, params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT product_id, name, price, stock_quantity, status, created_at
            FROM products
            WHERE name ILIKE $1
                AND shop_id = ${shop_id}
                AND ($4::numeric IS NULL OR price <= $4)
                AND ($5::numeric IS NULL OR price >= $5)
                AND (
                    $6::int[] IS NULL 
                    OR EXISTS (
                        SELECT 1 FROM product_categories 
                        WHERE product_categories.product_id = products.product_id
                        AND product_categories.category_id = ANY($6::int[])
                    )
                )
                AND ($7::text IS NULL OR status = $7)
                AND is_deleted = FALSE
            ORDER BY ${params.sortAttribute} ${params.sortOrder}
            LIMIT $2 OFFSET $3
        `;
        const limit         = Number(process.env.PAGINATION_LIMIT);
        const offset        = (params.page - 1) * limit;
        const filter        = params.filter as types.SellerProductFilter;
        const queryParams = [
            `%${params.keywords}%`,         // $1
            limit,                          // $2
            offset,                         // $3
            filter?.max_price,              // $4
            filter?.min_price,              // $5
            filter?.categories_id,          // $6
            filter?.status,                 // $7
        ];
        const result = await db.query(sql, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error listing products:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function addProduct(product: types.ProductAddRequest) {
    console.log("Product added:", product);
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO products (name, price, stock_quantity, shop_id)
            VALUES ($1, $2, $3, $4)
        `;
        const data = [product.name, product.price, product.stock_quantity, product.shop_id];
        await db.query(sql, data);
    } catch (error) {
        console.error('Error adding product to database:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function hideProduct(productId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET status = '${types.PRODUCT_STATUS.INACTIVE}'
            WHERE product_id = $1 AND is_deleted = FALSE AND status = '${types.PRODUCT_STATUS.ACTIVE}'
        `;
        await db.query(sql, [productId]);
    } catch (error) {
        console.error('Error hiding product:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function displayProduct(productId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET status = '${types.PRODUCT_STATUS.ACTIVE}'
            WHERE product_id = $1 AND status = '${types.PRODUCT_STATUS.INACTIVE}' AND is_deleted = FALSE
        `;
        await db.query(sql, [productId]);
    } catch (error) {
        console.error('Error displaying product:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####
async function list(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can list products' });
    }    
    const parsedBody = types.productSchemas.productParamsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send({ error: 'Invalid request data', details: parsedBody.error.format() });
    }
    const params: types.ProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);
    try {
        const products = await listProducts(req.user?.shop_id as number, params);
        res.send(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function remove(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).json({ error: 'Forbidden: Only sellers can remove products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId);
        if (!productExists) {
            return res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    console.log("Removing product with ID:", productId);
    try {
        await removeProduct(Number(req.user?.user_id), productId);
        res.status(204).json();
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function update(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can update products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId);
        if (!productExists) {
            return res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    const parsedBody = types.productSchemas.addRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ error: 'Invalid request data', details: parsedBody.error.format() });
    }
    const product: types.ProductAddRequest = parsedBody.data;
    try {
        // Ensure the shop_id is set from the authenticated user
        product.shop_id = req.user?.shop_id as number;
        await updateProduct(productId, product);
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(200).send({ message: 'Product updated successfully' });
}

async function add(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can add products' });
    }

    const parsedBody = types.productSchemas.addRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send({ error: 'Invalid request data', details: parsedBody.error.format() });
    }
    const product: types.ProductAddRequest = parsedBody.data;

    try {
        // Ensure the shop_id is set from the authenticated user
        product.shop_id = req.user?.shop_id as number;
        await addProduct(product);
    }
    catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(201).send({ message: 'Product added successfully' });
};

async function hide(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can hide products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId, types.PRODUCT_STATUS.ACTIVE);
        if (!productExists) {
            return res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    try {
        await hideProduct(productId);
    } catch (error) {
        console.error('Error hiding product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(200).send({ message: 'Product hidden successfully' });
}

async function display(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can display products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId, types.PRODUCT_STATUS.INACTIVE);
        if (!productExists) {
            return res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    try {
        await displayProduct(productId);
    } catch (error) {
        console.error('Error displaying product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(200).send({ message: 'Product displayed successfully' });
}

const sellerProductController = {
    list,
    add,
    remove,
    update,
    hide,
    display
};

export default sellerProductController;
