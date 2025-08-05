import express from 'express';
import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';

import * as types from '../types/index.types';

export async function listProducts(params: types.ProductParamsRequest) {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
                AND ($4::date IS NULL OR created_at >= $4::date)
                AND ($5::date IS NULL OR created_at <= $5::date)
                AND ($6::date IS NULL OR deleted_at >= $6::date)
                AND ($7::date IS NULL OR deleted_at <= $7::date)
                AND ($8::boolean IS NULL OR is_deleted = $8::boolean)
                AND ($9::integer IS NULL OR shop_id = $9::integer)
                AND ($10::text IS NULL OR (status = $10::text))
            ORDER BY ${params.sortAttribute} ${params.sortOrder}
            LIMIT $2 OFFSET $3
        `;
        const limit         = Number(process.env.PAGINATION_LIMIT);
        const offset        = (params.page - 1) * limit;
        const queryParams = [
            `%${params.keywords}%`,         // $1
            limit,                          // $2
            offset,                         // $3
            params.filter?.created_from,    // $4
            params.filter?.created_to,      // $5
            params.filter?.deleted_from,    // $6
            params.filter?.deleted_to,      // $7
            params.filter?.is_deleted,      // $8
            params.filter?.shop_id,         // $9
            params.filter?.status,          // $10
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

export async function addProduct(product: types.ProductAddRequest) {
    console.log("Product added:", product);
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
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
            releaseConnection(db);
        }
    }
}