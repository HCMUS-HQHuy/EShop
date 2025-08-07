import express from 'express';
import { Client } from 'pg';
import database from '../../config/db';

import * as types from '../../types/index.types';
import * as utils from '../../utils/index.utils';

// #### VALIDATION FUNCTIONS ####

// #### HELPER FUNCTIONS ####

// #### DATABASE FUNCTIONS ####

async function getProductInforById(productId: number): Promise<any | null> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                product_id, products.name as product_name, products.description as product_description, 
                price, stock_quantity, shop.shop_name AS shop_name, shop.shop_id AS shop_id
            FROM
                products
                JOIN shops as shop ON products.shop_id = shop.shop_id
            WHERE 
                product_id = $1 
                AND products.status = '${types.PRODUCT_STATUS.ACTIVE}' AND products.is_deleted = FALSE
        `;
        const result = await db.query(sql, [productId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
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
            SELECT product_id, name, price, stock_quantity, shop_id, image_url
            FROM products
            WHERE name ILIKE $1
                AND status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND is_deleted = FALSE
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
            ORDER BY ${params.sortAttribute} ${params.sortOrder}
            LIMIT $2 OFFSET $3
        `;
        const limit         = Number(process.env.PAGINATION_LIMIT);
        const offset        = (params.page - 1) * limit;
        const filter        = params.filter as types.UserProductFilter;
        const queryParams = [
            `%${params.keywords}%`,         // $1
            limit,                          // $2
            offset,                         // $3
            filter?.max_price,              // $4
            filter?.min_price,              // $5
            filter?.categories_id,          // $6
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

async function getRelatedProductsById(productId: number): Promise<any[]> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT product_id, name, price, stock_quantity, shop_id, image_url
            FROM products
            WHERE product_id != $1
                AND product_id IN (
                    SELECT product_id FROM product_categories
                    WHERE category_id IN (
                        SELECT category_id FROM product_categories 
                        WHERE product_id = $1
                    )
                )
                AND status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND is_deleted = FALSE
            LIMIT 10
        `;
        const result = await db.query(sql, [productId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: types.RequestCustom, res: express.Response) {
    console.log("Listing products with params:", req.query);
    const parsedBody = types.productSchemas.productParamsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send({ 
            error: 'Invalid request data', 
            details: parsedBody.error.format() 
        });
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

async function getDetailById(req: types.RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
        return res.status(400).send({ error: 'Product ID is required and must be a number' });
    }
    console.log("Fetching product details for ID:", productId);
    if (productId <= 0) {
        return res.status(400).send({ error: 'Product ID must be a positive number' });
    }

    try {
        const product = await getProductInforById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

async function getRelatedProducts(req: types.RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
        return res.status(400).send({ error: 'Product ID is required and must be a number' });
    }
    console.log("Fetching related products for ID:", productId);
    if (productId <= 0) {
        return res.status(400).send({ error: 'Product ID must be a positive number' });
    }

    try {
        const relatedProducts = await getRelatedProductsById(productId);
        res.send(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

// #### EXPORTS ####
const product = {
    list,
    getDetailById,
    getRelatedProducts
};
export default product;