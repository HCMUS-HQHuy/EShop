import express from 'express';
import * as types from 'types/index.types';
import * as utils from 'utils/index.utils';

import { Client } from 'pg';
import database from 'database/index.database';

// #### HELPER FUNCTIONS ####

async function review(req: express.Request, res: express.Response, status: types.ProductStatus) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    if (productId <= 0) {
        return res.status(400).send({ error: 'Product ID must be a positive integer' });
    }
    try {
        const productExists = await checkProductExists(productId, types.PRODUCT_STATUS.PENDING);
        if (!productExists) {
            return res.status(404).send({ error: 'Product not found' });
        }
        await updateProductStatus(productId, status);
        return res.status(200).send({ message: 'Product reviewed successfully' });
    } catch (error) {
        console.error('Error reviewing product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

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

async function updateProductStatus(productId: number, status: types.ProductStatus): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET status = $1
            WHERE product_id = $2 AND is_deleted = FALSE
        `;
        await db.query(sql, [status, productId]);
    } catch (error) {
        console.error('Error updating product status:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

async function listProducts(params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
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
                AND ($8::integer IS NULL OR shop_id = $8)
                AND ($9::boolean IS NULL OR is_deleted = $9)
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
            filter?.shop_id,                // $8
            filter?.is_deleted              // $9
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

// #### CONTROLLER FUNCTIONS ####

async function list(req: types.RequestCustom, res: express.Response) {
    if (utils.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can access this route' });
    }
    const parsedBody = types.productSchemas.productParamsRequest.safeParse(req.query);
    console.log("Parsed body for listing products:", req.query);
    if (!parsedBody.success) {
        return res.status(400).send({ error: 'Invalid request data', details: parsedBody.error.format() });
    }
    const params: types.ProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);

    try {
        const products = await listProducts(params);
        res.send(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function reject(req: types.RequestCustom, res: express.Response) {
    if (utils.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can reject products' });
    }
    return review(req, res, types.PRODUCT_STATUS.REJECTED);
}

async function approve(req: types.RequestCustom, res: express.Response) {
    if (utils.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can approve products' });
    }
    return review(req, res, types.PRODUCT_STATUS.ACTIVE);
}

async function ban(req: types.RequestCustom, res: express.Response) {
    if (utils.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can ban products' });
    }
    return review(req, res, types.PRODUCT_STATUS.BANNED);
}

const product = {
    reject,
    approve,
    ban,
    list
};
export default product;