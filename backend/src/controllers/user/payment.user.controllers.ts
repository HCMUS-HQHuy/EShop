import express from 'express';
import database from 'src/database/index.database';
import { Client } from 'pg';
import { PAYMENT_STATUS } from '@prisma/client';
import { RequestCustom } from 'src/types/common.types';

async function announce(req: RequestCustom, res: express.Response) {
    // console.log('Payment announce:', req.body);
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            UPDATE payments
            SET status = '${PAYMENT_STATUS.COMPLETED}'
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