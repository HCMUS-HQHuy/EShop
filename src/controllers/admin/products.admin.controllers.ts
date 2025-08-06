import express from 'express';
import * as types from '../../types/index.types';
import * as utils from '../../utils/index.utils';

import { Client } from 'pg';
import { getConnection, releaseConnection } from '../../config/db';


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

// #### CONTROLLER FUNCTIONS ####
async function review(req: express.Request, res: express.Response) {
    if (utils.isAdmin(req) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can review products' });
    }
    
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
        return res.status(200).send({ message: 'Product reviewed successfully' });
    } catch (error) {
        console.error('Error reviewing product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

const product = {
    review
};
export default product;