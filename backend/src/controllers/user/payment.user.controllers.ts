import express from 'express';
import * as types from 'types/index.types';
import database from 'database/index.database';
import { Client } from 'pg';

async function announce(req: types.RequestCustom, res: express.Response) {
    // console.log('Payment announce:', req.body);
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE payments
            SET status = '${types.PAYMENT_STATUS.COMPLETED}'
            WHERE payment_code = $1
        `;
        await db.query(sql, [req.body.requestId]);
    } catch (error) {
        console.log('Update database errors:', error);
    } finally {
        if (db) {
            database.releaseConnection(db);
        }
    }
    res.send();
}

const payment = {
    announce
};
export default payment;