import express from 'express';
import { Client } from 'pg';
import database from 'src/database/index.database';
import util from 'src/utils/index.utils';
import schemas from 'src/schemas/index.schema';
import { PRODUCT_STATUS } from '@prisma/client';
import { ProductInformation, ProductParamsRequest, RequestCustom, SellerProductFilter } from 'src/types/index.types';
import { PAGINATION_LIMIT } from 'src/constants/globalVariables';
import prisma from 'src/models/prismaClient';

// #### DATABASE FUNCTIONS ####

async function checkProductExists(productId: number, status?: PRODUCT_STATUS): Promise<boolean> {
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

async function listProducts(shopId: number, params: ProductParamsRequest) {
    try {
        const limit         = PAGINATION_LIMIT;
        const offset        = (params.page - 1) * limit;
        const filter        = params.filter as SellerProductFilter;
        const products = prisma.products.findMany({
            where: { 
                shopId: shopId, 
                isDeleted: false, 
                price: { lte: filter?.max_price ?? undefined, gte: filter?.min_price ?? undefined }, 
                status: filter?.status ?? undefined,
                name: { contains: params.keywords, mode: 'insensitive' },
                productCategories: filter?.categoriesId ? { some: { categoryId: { in: filter.categoriesId } } } : undefined
            },
            skip: offset,
            take: limit,
            orderBy: { [params.sortAttribute]: params.sortOrder },
            select: { productId: true, imageUrl: true, shortName: true, sku: true, price: true, discount: true, stockQuantity: true, status: true }
        })
        return products;
    } catch (error) {
        console.error('Error listing products:', error);
        throw error;
    }
}

async function hideProduct(productId: number): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE products
            SET status = '${PRODUCT_STATUS.INACTIVE}'
            WHERE product_id = $1 AND is_deleted = FALSE AND status = '${PRODUCT_STATUS.ACTIVE}'
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
            SET status = '${PRODUCT_STATUS.ACTIVE}'
            WHERE product_id = $1 AND status = '${PRODUCT_STATUS.INACTIVE}' AND is_deleted = FALSE
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
async function list(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    const parsedBody = schemas.product.paramsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: ProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);
    try {
        const products = await listProducts(req.user?.shop?.shopId as number, params);
        res.status(200).send(util.response.success('Products listed successfully', { products: products }));
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send(util.response.internalServerError());
    }
}

async function remove(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
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
        await removeProduct(Number(req.user?.userId), productId);
        res.status(204).json();
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json(util.response.internalServerError());
    }
}

async function getById(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send(util.response.error('Invalid product ID'));
    }
    console.log("Fetching product with ID:", productId);
    try {
        const data = await prisma.products.findUnique({
            where: { productId: productId },
            select: {
                name: true, sku: true, price: true, discount: true, stockQuantity: true, status: true,
                shortName: true, description: true, imageUrl: true,
                productCategories: { select: { categoryId: true } },
                productImages: { select: { imageUrl: true } },
            }
        });
        if (data === null) {
            return res.status(404).send(util.response.error('Product not found'));
        }
        const product = {
            ...data,
            categories: data.productCategories.map(pc => pc.categoryId),
            additionalImages: data.productImages.map(pi => (pi.imageUrl)),
        }
        res.status(200).send(util.response.success('Product fetched successfully', { product }));
    } catch (error) {
        console.log('error fetch product with id', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

async function update(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    const parsedBody = schemas.product.information.safeParse(req.body);
    if (!parsedBody.success) {
        console.log('Validation failed', parsedBody.error.issues, req.body);
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const product: ProductInformation = parsedBody.data;
    console.log("Parsed product data:", product);
    try {
        product.shopId = req.user?.shop?.shopId as number;
        if (req.files && 'imageUrl' in req.files) {
            product.imageUrl = (req.files['imageUrl'] as Express.Multer.File[])[0].filename;
        } else product.imageUrl = product.imageUrl?.substring(product.imageUrl?.lastIndexOf('/') + 1);

        console.log(product);

        console.log("Product added:", product);
        const updatedProduct = await prisma.products.update({
            where: { productId: productId, shopId: product.shopId },
            data: {
                name: product.name,
                sku: product.sku,
                shortName: product.shortName,
                price: product.price,
                discount: product.discount,
                description: product.description,
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl,
                status: product.status,
                productCategories: { deleteMany: {}, create: product.categories.map(categoryId => ({ categoryId }))  },
                productImages: {
                    deleteMany: { imageUrl: { in: product.deletedImages ?? [] } },
                    createMany: (req.files && 'additionalImages' in req.files
                        ? { data: (req.files['additionalImages'] as Express.Multer.File[]).map(file => ({ imageUrl: file.filename })) }
                        : undefined)
                }
            },
            select: { productId: true }
        });
        if (updatedProduct === null) {
            return res.status(404).send(util.response.error('Product not found', []));
        }
        return res.status(200).send(util.response.success('Product updated successfully', { productId: updatedProduct.productId }));
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

async function add(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send(util.response.authorError('sellers'));
    }
    console.log("Files received:", req.files);
    if (!req.files || !('mainImage' in req.files)) {
        return res.status(400).send(util.response.error( 'Main image (mainImage) is required'));
    }
    console.log("Add product request body:", req.body);
    const parsedBody = schemas.product.information.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const product: ProductInformation = parsedBody.data;
    console.log("Parsed product data:", product);
    try {
        product.shopId = req.user?.shop?.shopId as number;
        product.imageUrl = (req.files['imageUrl'] as Express.Multer.File[])[0].filename;
        console.log("Product added:", product);
        await prisma.products.create({
            data: {
                name: product.name,
                sku: product.sku,
                shortName: product.shortName,
                price: product.price,
                discount: product.discount,
                description: product.description,
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl,
                shopId: product.shopId,
                status: product.status,
                productCategories: { create: product.categories.map(categoryId => ({ categoryId })) },
                productImages: {
                    create: (req.files['additionalImages'] as Express.Multer.File[] | undefined)?.map(file => ({ imageUrl: file.filename })) || []
                }
            },
        })
        res.status(201).send(util.response.success('Product added successfully'));
    }
    catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).send(util.response.internalServerError());
    }
};

async function hide(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can hide products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId, PRODUCT_STATUS.ACTIVE);
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

async function display(req: RequestCustom, res: express.Response) {
    if (util.role.isAcceptedSeller(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can display products' });
    }
    const productId = Number(req.params.id);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    try {
        const productExists = await checkProductExists(productId, PRODUCT_STATUS.INACTIVE);
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
