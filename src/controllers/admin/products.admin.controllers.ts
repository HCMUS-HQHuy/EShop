import express from 'express';
import * as types from '../../types/index.types';
import * as utils from '../../utils/index.utils';

import { Client } from 'pg';
import { getConnection, releaseConnection } from '../../config/db';

// #### VALIDATION FUNCTIONS ####

 function validateProductFilters(req: types.RequestCustom): types.ValidationResult {
    const errors: Partial<Record<string, string>> = {};

    if (req.query.keywords && String(req.query.keywords).trim() === "") {
        errors.keywords = "Keywords must not be empty";
    }
    if (req.query.page && Number(req.query.page) < 1) {
        errors.page = "Page must be greater than 0";
    }
    if (req.query.sortAttribute && !types.SORT_ATTRIBUTES.includes(req.query.sortAttribute as types.SortAttribute)) {
        errors.sortAttribute = "Invalid sort attribute";
    }
    if (req.query.sortOrder && !types.SORT_ORDERS.includes(req.query.sortOrder as types.SortOrder)) {
        errors.sortOrder = "Invalid sort order";
    }

    if (req.query.status && !Object.values(types.PRODUCT_STATUS).includes(req.query.status as types.ProductStatus)) {
        errors.status = 'Invalid product status';
    }

    if (req.query.category_id && (isNaN(Number(req.query.category_id)) || Number(req.query.category_id) <= 0)) {
        errors.category_id = 'Category ID must be a positive number';
    }

    if (req.query.minPrice && (isNaN(Number(req.query.minPrice)) || Number(req.query.minPrice) < 0)) {
        errors.minPrice = 'Minimum price must be a non-negative number';
    }

    if (req.query.maxPrice && (isNaN(Number(req.query.maxPrice)) || Number(req.query.maxPrice) < 0)) {
        errors.maxPrice = 'Maximum price must be a non-negative number';
    }

    if (req.query.minPrice && req.query.maxPrice && Number(req.query.minPrice) > Number(req.query.maxPrice)) {
        errors.priceRange = 'Minimum price cannot be greater than maximum price';
    }

    if (req.query.shop_id && (isNaN(Number(req.query.shop_id)) || Number(req.query.shop_id) <= 0)) {
        errors.shop_id = 'Shop ID must be a positive number';
    }

    if (req.query.is_deleted && typeof req.query.is_deleted !== 'boolean') {
        errors.is_deleted = 'is_deleted must be a boolean value';
    }

    return { 
        valid: Object.keys(errors).length === 0, 
        errors
    };
}

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

function getFilterParamsForProducts(req: types.RequestCustom): types.ProductParamsRequest  {
    const params: types.ProductParamsRequest = {
        page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
        sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
        sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
        keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
        filter: {
            status: req.query.status !== undefined ? String(req.query.status) as types.ProductStatus : undefined,
        }
    };
    return params;
}

// #### DATABASE FUNCTIONS ####

async function checkProductExists(productId: number, status?: types.ProductStatus): Promise<boolean> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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
            releaseConnection(db);
        }
    }
}

async function updateProductStatus(productId: number, status: types.ProductStatus): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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
            releaseConnection(db);
        }
    }
}

async function listProducts(params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
                AND ($4::numeric IS NULL OR price <= $4)
                AND ($5::numeric IS NULL OR price >= $5)
                AND ($6::integer IS NULL OR category_id = $6)
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
            filter?.category_id,            // $6
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
            releaseConnection(db);
        }
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: types.RequestCustom, res: express.Response) {
    if (utils.isAdmin(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can access this route' });
    }
    console.log("Listing products with params:", req.query);
    const validationError = validateProductFilters(req);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

    const params: types.ProductParamsRequest = getFilterParamsForProducts(req);
    console.log("Listing products with params:", params);

    try {
        const products = await listProducts(params);
        res.send(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function reject(req: express.Request, res: express.Response) {
    if (utils.isAdmin(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can reject products' });
    }
    return review(req, res, types.PRODUCT_STATUS.REJECTED);
}

async function approve(req: express.Request, res: express.Response) {
    if (utils.isAdmin(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can approve products' });
    }
    return review(req, res, types.PRODUCT_STATUS.ACTIVE);
}

async function ban(req: express.Request, res: express.Response) {
    if (utils.isAdmin(req) === false) {
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