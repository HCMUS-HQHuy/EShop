import { Client } from 'pg';
import database from 'src/database/index.database';
import { env } from 'process';

import * as utils from 'src/utils/index.utils';

export default async function seedAdmin() {
    let db: Client | undefined = undefined;

    try {
        db = await database.getConnection();
        const checkQuery = `
            SELECT * FROM users 
            WHERE username = $1 AND role = 'Admin'
        `;
        const result = await db.query(checkQuery, [env.DB_ADMIN_USERNAME]);

        if (result.rows.length > 0) {
            console.log('Log: Admin user already exists. Skipping...');
            return;
        }

        const insertQuery = `
            INSERT INTO users (username, password, email, fullname, role)
            VALUES ($1, $2, $3, $4, 'Admin')
        `;
        const password = utils.hashPassword(env.DB_ADMIN_PASSWORD as string);
        await db.query(insertQuery, [
            env.DB_ADMIN_USERNAME,
            password,
            env.DB_ADMIN_EMAIL,
            'System Administrator',
        ]);
        console.log('Admin user created successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        if (db) {
            await database.releaseConnection(db);
        }
    }
}
