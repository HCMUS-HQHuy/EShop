import express from 'express';

import * as service from '../services/products.services';
import * as utils from '../utils/index.util';
import * as types from '../types/index.types';

export async function listProducts(req: types.RequestCustom, res: express.Response) {
    console.log("Listing products with params:", req.query);
    const params: types.ProductParamsRequest = utils.getFilterParamsForProducts(req);
    const validationError = await utils.validateProductFilters(params);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

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
