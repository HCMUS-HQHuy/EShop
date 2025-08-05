import express from 'express';

import * as service from '../services/products.services';
import * as utils from '../utils/index.util';
import * as types from '../types/index.types';

export async function listProducts(req: types.RequestCustom, res: express.Response) {
    console.log("Listing products with params:", req.query);

    const params: types.ProductParamsRequest = {
        page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
        sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
        sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
        keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
        filter: {
            created_from: req.query.created_from !== undefined ? String(req.query.created_from) : undefined,
            created_to: req.query.created_to !== undefined ? String(req.query.created_to) : undefined,
            deleted_from: req.query.deleted_from !== undefined ? String(req.query.deleted_from) : undefined,
            deleted_to: req.query.deleted_to !== undefined ? String(req.query.deleted_to) : undefined,
            is_deleted: req.query.is_deleted !== undefined ? Boolean(req.query.is_deleted === "true") : undefined,

            shop_id: req.user?.role === types.USER_ROLE.SELLER ? Number(req.user?.shop_id) : undefined, 
            // dành cho seller (chỉ được truy cập hàng của shop mình cái này xem kĩ hơn)
            status: req.query.status !== undefined ? String(req.query.status) as types.ProductStatus : undefined,
        }
    };

    console.log("Listing products with params:", params);

    try {
        const products = await service.listProducts(params);
        res.send(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export async function addProduct(req: types.RequestCustom, res: express.Response) {
    if (utils.isSeller(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only sellers can add products' });
    }

    const product: types.ProductAddRequest = req.body;
    try {
        const validationResult = await utils.validateProductData(product);
        if (!validationResult.valid) {
            return res.status(400).send({ errors: validationResult.errors });
        }
    } catch (error) {
        console.error('Error validating product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    try {
        product.shop_id = req.user?.shop_id as number;
        await service.addProduct(product);
    }
    catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(201).send({ message: 'Product added successfully' });
};
