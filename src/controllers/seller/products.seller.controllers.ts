import express from 'express';
import { Client } from 'pg';
import database from '../../config/db';
import * as utils from '../../utils/index.utils';
import * as types from '../../types/index.types';

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
        errors.sortAttribute = "Invalid sort attribute: must be 'name' or 'created_at'";
    } else if (req.query.sortAttribute && String(req.query.sortAttribute).trim() === "") {
        errors.sortAttribute = "Sort attribute must not be empty";
    } else if (req.query.sortAttribute && (req.query.sortOrder == undefined || !types.SORT_ORDERS.includes(req.query.sortOrder as types.SortOrder))) {
        errors.sortOrder = "Invalid sort order: must be 'asc' or 'desc' if sort attribute is provided";
    }

    if (req.query.sortOrder && !types.SORT_ORDERS.includes(req.query.sortOrder as types.SortOrder)) {
        errors.sortOrder = "Invalid sort order: must be 'asc' or 'desc'";
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

    return {
        valid: Object.keys(errors).length === 0, 
        errors
    };
}

function validateProductData(data: types.ProductAddRequest): types.ValidationResult {
    const errors: Partial<Record<keyof types.ProductAddRequest, string>> = {};
    if (data?.name === undefined || data.name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (data?.price === undefined || data.price < 0) {
        errors.price = 'Price must be a non-negative number';
    }

    if (data?.stock_quantity === undefined || data.stock_quantity < 0) {
        errors.stock_quantity = 'Stock quantity must be a non-negative number';
    }

    if (data?.category_id === undefined || data.category_id <= 0) {
        errors.category_id = 'Category ID must be a positive number';
    }
    return { 
        valid: Object.keys(errors).length === 0, 
        errors
    };
}

// #### HELPER FUNCTIONS ####
function getFilterParamsForProducts(req: types.RequestCustom): types.ProductParamsRequest  {
    const params: types.ProductParamsRequest = {
        page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
        sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
        sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
        keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
        filter: {
            status: req.query.status !== undefined ? String(req.query.status) as types.ProductStatus : undefined,
            category_id: req.query.category_id !== undefined ? Number(req.query.category_id) : undefined,
            min_price: req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined,
            max_price: req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined
        }
    };
    return params;
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
            SET name = $1, price = $2, stock_quantity = $3, 
                category_id = $4, shop_id = $5, 
                status = '${types.PRODUCT_STATUS.PENDING}'
            WHERE product_id = $6 AND is_deleted = FALSE
        `;
        const data = [product.name, product.price, product.stock_quantity, product.category_id, product.shop_id, productId];
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
            SELECT product_id, name, price, stock_quantity, category_id, status, created_at
            FROM products
            WHERE name ILIKE $1
                AND shop_id = ${shop_id}
                AND ($4::numeric IS NULL OR price <= $4)
                AND ($5::numeric IS NULL OR price >= $5)
                AND ($6::integer IS NULL OR category_id = $6)
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
            filter?.category_id,            // $6
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
            INSERT INTO products (name, price, stock_quantity, category_id, shop_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const data = [product.name, product.price, product.stock_quantity, product.category_id, product.shop_id];
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
    const product: types.ProductAddRequest = req.body;
    try {
        const validationResult = validateProductData(product);
        if (!validationResult.valid) {
            return res.status(400).send({ errors: validationResult.errors });
        }
    } catch (error) {
        console.error('Error validating product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
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

    const product: types.ProductAddRequest = req.body;
    try {
        const validationResult = validateProductData(product);
        if (!validationResult.valid) {
            return res.status(400).send({ errors: validationResult.errors });
        }
    } catch (error) {
        console.error('Error validating product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }

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
