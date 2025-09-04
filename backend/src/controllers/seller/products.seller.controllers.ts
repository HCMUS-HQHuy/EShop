import express from 'express';
import { Client } from 'pg';
import database from 'database/index.database';
import util, * as utils from 'utils/index.utils';
import * as types from 'types/index.types';
import fs from 'fs';

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

async function listProducts(shop_id: number, params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT
                product_id as "productId",
                image_url as "imageUrl",
                short_name as "shortName", 
                sku, price, discount, 
                stock_quantity as "stockQuantity", 
                500 as sold, 4 as rating, status
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
                AND ($7::text IS NULL OR 'status' = $7)
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
    if (utils.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    const parsedBody = types.productSchemas.productParamsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: types.ProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);
    try {
        const products = await listProducts(req.user?.shop_id as number, params);
        res.status(200).send(util.response.success('Products listed successfully', { products: products }));
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send(util.response.internalServerError());
    }
}

async function remove(req: types.RequestCustom, res: express.Response) {
    if (utils.isAcceptedSeller(req.user) === false) {
        return res.status(403).json(util.response.authorError('sellers'));
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).json(util.response.error('Invalid product ID', []));
    }
    try {
        const productExists = await checkProductExists(productId);
        if (!productExists) {
            return res.status(404).json(util.response.error('Product not found', []));
        }
    } catch (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).json(util.response.internalServerError());
    }

    console.log("Removing product with ID:", productId);
    try {
        await removeProduct(Number(req.user?.user_id), productId);
        res.status(204).json();
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json(util.response.internalServerError());
    }
}

async function getById(req: types.RequestCustom, res: express.Response) {
    if (utils.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send(util.response.error('Invalid product ID'));
    }
    console.log("Fetching product with ID:", productId);
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const result = await db.query(`
            SELECT
                name, sku, price, discount, stock_quantity, status,
                short_name as "shortName",
                product_categories.category_id as "category",
                products.description,
                products.image_url as "mainImage", 
                product_images.image_url as "additionalImage"
            FROM 
                products
                LEFT JOIN 
                    product_categories ON products.product_id = product_categories.product_id
                LEFT JOIN
                    product_images ON products.product_id = product_images.product_id
            WHERE products.product_id = $1 AND shop_id = $2
        `, [productId, req.user?.shop_id]);
        if (!result.rows[0]) {
            return res.status(404).send(util.response.error('Product not found'));
        }
        const product = result.rows[0];
        const data = {
            ...product,
            mainImage: `${process.env.PUBLIC_URL}/${product.mainImage}`,
            categories: result.rows.map(row => row.category).reduce((acc: number[], curr: number) => {
                if (!acc.includes(curr)) acc.push(curr);
                return acc;
            }, []),
            additionalImages: result.rows.map(row => `${process.env.PUBLIC_URL}/${row.additionalImage}`)
        }
        res.status(200).send(util.response.success('Product fetched successfully', { product: data }));
    } catch (error) {
        console.log('error fetch product with id', error);
        return res.status(500).send(util.response.internalServerError());
    } finally {
        if (db) {
            database.releaseConnection(db);
        }
    }
}

async function update(req: types.RequestCustom, res: express.Response) {
    if (utils.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
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
    const parsedBody = types.productSchemas.information.safeParse(req.body);
    if (!parsedBody.success) {
        console.log('Validation failed', parsedBody.error.issues, req.body);
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const product: types.ProductInformation = parsedBody.data;
    console.log("Parsed product data:", product);

    let db: Client | undefined = undefined;
    try {
        product.shop_id = req.user?.shop_id as number;
        if (req.files && 'mainImage' in req.files) {
            product.mainImage = (req.files['mainImage'] as Express.Multer.File[])[0].filename;
        } else product.mainImage = product.mainImage?.substring(product.mainImage?.lastIndexOf('/') + 1);

        console.log("Product added:", product);
        db = await database.getConnection();
        await db.query('BEGIN');
        const sql = `
            UPDATE products
            SET name = $1, sku = $2, short_name = $3, price = $4, discount = $5, description = $6, stock_quantity = $7, image_url = $8, status = $9
            WHERE shop_id = $10 AND product_id = $11
        `;
        const data = [
            product.name,
            product.sku,
            product.shortName,
            product.price,
            product.discount,
            product.description,
            product.stock_quantity,
            product.mainImage,
            product.status,
            product.shop_id,
            productId,
        ];
        await db.query(sql, data);
        await db.query('DELETE FROM product_categories WHERE product_id = $1', [productId]);
        const valuesSQL = product.categories
            .map((_, index) => `($1, $${index + 2})`)
            .join(', ');
        if (valuesSQL) {
            const sql2 = `
                INSERT INTO product_categories (product_id, category_id)
                VALUES ${valuesSQL}
            `;
            const params = [productId, ...product.categories];
            await db.query(sql2, params);
        }

        if (req.files && 'additionalImages' in req.files) {
            const valuesImageSQL = (req.files['additionalImages'] as Express.Multer.File[] | undefined)?.map((_, index) => `($1, $${index + 2})`).join(', ');
            if (valuesImageSQL) {
                const sql3 = `
                    INSERT INTO product_images (product_id, image_url)
                    VALUES ${valuesImageSQL}
                `;
                const imageUrls = (req.files['additionalImages'] as Express.Multer.File[]).map(file => file.filename);
                const paramsImage = [productId, ...imageUrls];
                await db.query(sql3, paramsImage);
            }
        }
        const deletedImages = product.deletedImages || [];
        if (deletedImages.length > 0) {
            console.log('Deleting images:', deletedImages);
            deletedImages.forEach(url=>{
                // fs.unlink(`/home/huy/EShop/backend/uploads/${url}`, (err) => {
                //     if (err) {
                //         console.error(`Failed to delete image file: ${url}`, err);
                //     }
                // });
            });
            const deleteSQL = `
                DELETE FROM product_images
                WHERE product_id = $1 AND image_url = ANY($2::text[])
            `;
            await db.query(deleteSQL, [productId, deletedImages]);
        }
        await db.query('COMMIT');
    } catch (error) {
        if (db) {
            await db.query('ROLLBACK');
        }
        console.error('Error adding product:', error);
        return res.status(500).send(util.response.internalServerError());
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
    res.status(200).send(util.response.success('Product updated successfully', []));
}

async function add(req: types.RequestCustom, res: express.Response) {
    if (utils.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    console.log("Files received:", req.files);
    if (!req.files || !('mainImage' in req.files)) {
        return res.status(400).send(util.response.error( 'Main image (mainImage) is required'));
    }
    console.log("Add product request body:", req.body);
    const parsedBody = types.productSchemas.information.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const product: types.ProductInformation = parsedBody.data;
    console.log("Parsed product data:", product);
    let db: Client | undefined = undefined;
    try {
        product.shop_id = req.user?.shop_id as number;
        product.mainImage = (req.files['mainImage'] as Express.Multer.File[])[0].filename;
        console.log("Product added:", product);
        db = await database.getConnection();
        await db.query('BEGIN');
        const sql = `
            INSERT INTO products (name, sku, short_name, price, discount, description, stock_quantity, image_url, shop_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING product_id
        `;
        const data = [
            product.name,
            product.sku,
            product.shortName,
            product.price,
            product.discount,
            product.description,
            product.stock_quantity,
            product.mainImage,
            product.shop_id,
            product.status
        ];
        const result = await db.query(sql, data);
        const productId = result.rows[0].product_id;

        console.log("Inserted product ID:", productId);
        const valuesSQL = product.categories
            .map((_, index) => `($1, $${index + 2})`)
            .join(', ');
        if (valuesSQL) {
            const sql2 = `
                INSERT INTO product_categories (product_id, category_id)
                VALUES ${valuesSQL}
            `;
            const params = [productId, ...product.categories];
            await db.query(sql2, params);
        }

        const valuesImageSQL = (req.files['additionalImages'] as Express.Multer.File[] | undefined)?.map((_, index) => `($1, $${index + 2})`).join(', ');
        if (valuesImageSQL) {
            const sql3 = `
                INSERT INTO product_images (product_id, image_url)
                VALUES ${valuesImageSQL}
            `;
            const imageUrls = (req.files['additionalImages'] as Express.Multer.File[]).map(file => file.filename);
            const paramsImage = [productId, ...imageUrls];
            await db.query(sql3, paramsImage);
        }
        await db.query('COMMIT');
        res.status(201).send(util.response.success('Product added successfully'));
    }
    catch (error) {
        if (db) {
            await db.query('ROLLBACK');
        }
        console.error('Error adding product:', error);
        return res.status(500).send(util.response.internalServerError());
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
};

async function hide(req: types.RequestCustom, res: express.Response) {
    if (utils.isAcceptedSeller(req.user) === false) {
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
    if (utils.isAcceptedSeller(req.user) === false) {
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
    getById,
    remove,
    update,
    hide,
    display
};

export default sellerProductController;
