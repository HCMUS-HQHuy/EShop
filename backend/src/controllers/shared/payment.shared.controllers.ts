import express from 'express';
import util from 'src/utils/index.utils';
import * as types from 'src/types/index.types';
import { Client } from 'pg';
import database from 'src/database/index.database';

async function getAll(req: types.RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT payment_method_id, code, name, img, link
            FROM payment_methods
            WHERE is_active = true
            ORDER BY code DESC
        `
        const result = await db.query(sql);
        const data = result.rows.map(row => ({
            id: row.payment_method_id,
            code: row.code,
            name: row.name,
            img: row.img ? `${process.env.STATIC_URL}/${row.img}` : null,
            link: row.link
        }));
        res.status(200).json(util.response.success('Success', { paymentMethods: data }));
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        if (db) {
            database.releaseConnection(db);
        }
    }
};

const paymentMethod = {
  getAll
}

export default paymentMethod;
