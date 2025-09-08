import express from 'express';
import { Client } from 'pg';
import database from 'src/database/index.database';
import util from 'src/utils/index.utils';
import schemas from 'src/schemas/index.schema';
import { PRODUCT_STATUS } from 'src/types/index.types';
import { RequestCustom, ProductParamsRequest, UserProductFilter } from 'src/types/index.types';
import { PAGINATION_LIMIT } from 'src/constants/globalVariables';

// #### HELPER FUNCTIONS ####
async function getAllCategoriesId(categories: number[] | undefined): Promise<number[]> {
    if (!categories || categories.length === 0) {
        return [];
    }
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT category_id FROM categories
            WHERE parent_id = ANY($1::int[])
        `;
        const result = await db.query(sql, [categories]);
        const subCategories_id = result.rows.map(row => row.category_id);
        return [...categories, ...(await getAllCategoriesId(subCategories_id))];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
}

// #### DATABASE FUNCTIONS ####

async function getProductInforById(productId: number): Promise<any | null> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT
                products.product_id as "id",
                products.shop_id as "shopId",
                products.name as "name",
                products.short_name as "shortName",
                products.description as "description",
                price as "price",
                discount,
                stock_quantity as "stockQuantity",
                shop.user_id as "sellerId",
                shop.shop_name AS "shopName",
                shop.shop_id AS "shopId",
                products.image_url as "img",
                product_images.image_url as "additionalImg",
                product_categories.category_id as "categoryId"
            FROM
                products
                JOIN 
                    shops as shop ON products.shop_id = shop.shop_id
                LEFT JOIN 
                    product_categories ON products.product_id = product_categories.product_id
                LEFT JOIN
                    product_images ON products.product_id = product_images.product_id
            WHERE 
                products.product_id = $1 
                AND products.status = '${PRODUCT_STATUS.ACTIVE}' AND products.is_deleted = FALSE
        `;
        const result = await db.query(sql, [productId]);
        const product = result.rows;
        if (product.length === 0) {
            return null;
        }
        const data = {
            ...product[0],
            img: `${process.env.PUBLIC_URL}/${product[0].img}`,
            categoryIds: product.map((p) => p.categoryId),
            additionalImages: product.map((p) => `${process.env.PUBLIC_URL}/${p.additionalImg}`)
        };
        return data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
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
                AND status = '${PRODUCT_STATUS.ACTIVE}'
                AND is_deleted = FALSE
            LIMIT 10
        `;
        const result = await db.query(sql, [productId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: RequestCustom, res: express.Response) {
    const parsedBody = schemas.product.paramsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: ProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);

    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                product_id as id,
                shop_id as "shopId",
                short_name as "shortName",
                name,
                price,
                discount,
                stock_quantity as quantity,
                image_url as img,
                TO_CHAR(created_at, 'YYYY-MM-DD') as "addedDate",
                0 as rate,
                0 as votes
            FROM products
            WHERE name ILIKE $1
                AND status = '${PRODUCT_STATUS.ACTIVE}'
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
        const limit = PAGINATION_LIMIT;
        const offset = (params.page - 1) * limit;
        const filter = params.filter as UserProductFilter;
        const categoriesId = await getAllCategoriesId(filter?.categories_id);
        const queryParams = [
            `%${params.keywords}%`,                         // $1
            limit,                                          // $2
            offset,                                         // $3
            filter?.max_price,                              // $4
            filter?.min_price,                              // $5
            categoriesId.length > 0 ? categoriesId : null,  // $6
        ];
        const result = await db.query(sql, queryParams);
        const products = result.rows;
        for (const product of products) {
            product.img = `${process.env.PUBLIC_URL}/${product.img}`;
            const sql = `
                SELECT category_id
                FROM product_categories
                WHERE product_id = $1
            `;
            const result = await db.query(sql, [product.id]);
            product.categoryIds = result.rows.map(row => row.category_id);
        }
        res.status(200).send(util.response.success('Products fetched successfully', { products: products }));
    } catch (error) {
        console.error('Error listing products:', error);
        return res.status(500).send(util.response.internalServerError());
    } finally {
        await database.releaseConnection(db);
    }
}

async function getDetailById(req: RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
        return res.status(400).send(util.response.authorError('users'));
    }
    console.log("Fetching product details for ID:", productId);
    if (productId <= 0) {
        return res.status(400).send(util.response.error('ProductId must be a positive number', ));
    }

    try {
        const data = await getProductInforById(productId);
        if (!data) {
            return res.status(404).send(util.response.error('Product not found'));
        }
        res.status(200).send(util.response.success('Product details fetched successfully', { product: data }));
    } catch (error) {
        console.error('Error fetching product details:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

async function getRelatedProducts(req: RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
        return res.status(400).send(util.response.error('Product ID is required and must be a number'));
    }
    console.log("Fetching related products for ID:", productId);
    if (productId <= 0) {
        return res.status(400).send(util.response.error('Product ID must be a positive number'));
    }

    try {
        const relatedProducts = await getRelatedProductsById(productId);
        res.send(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

// #### EXPORTS ####
const product = {
    list,
    getDetailById,
    getRelatedProducts
};
export default product;