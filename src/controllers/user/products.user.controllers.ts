import express from 'express';
import { Client } from 'pg';
import { getConnection, releaseConnection } from '../../config/db';

import * as types from '../../types/index.types';
import * as utils from '../../utils/index.utils';

// #### VALIDATION FUNCTIONS ####

 function validateProductFilters(req: types.RequestCustom): types.ValidationResult {
    const errors: Partial<Record<string, string>> = {};

    if (req.query.keywords && String(req.query.keywords).trim() === "") {
        errors.keywords = "Keywords must not be empty";
    }
    if (req.query.page && Number(req.query.page) < 1) {
        errors.page = "Page must be greater than 0";
    }
    if (req.query.sortAttribute && !["name", "created_at"].includes(String(req.query.sortAttribute))) {
        errors.sortAttribute = "Invalid sort attribute";
    }
    if (req.query.sortOrder && !["asc", "desc"].includes(String(req.query.sortOrder))) {
        errors.sortOrder = "Invalid sort order";
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

// #### HELPER FUNCTIONS ####
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

async function listProducts(params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
                AND status = '${types.PRODUCT_STATUS.ACTIVE}'
                AND is_deleted = FALSE
                AND ($4::numeric IS NULL OR price <= $4)
                AND ($5::numeric IS NULL OR price >= $5)
                AND ($6::integer IS NULL OR category_id = $6)
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
            filter?.category_id,            // $6
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
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only users can list products' });
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

const product = {
    list,
};
export default product;