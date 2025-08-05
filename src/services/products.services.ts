import express from 'express';
import { Client } from 'pg';
import { getConnection, releaseConnection } from '../config/db';

import * as types from '../types/index.types';

export async function listProducts() {
    let db: Client | undefined = undefined;
    try {
        db = await getConnection();
        const sql = `
            SELECT * FROM products
        `;
        const result = await db.query(sql);
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
            INSERT INTO products (name, price, stock_quantity, category_id, seller_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const data = [product.name, product.price, product.stock_quantity, product.category_id, product.seller_id];
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