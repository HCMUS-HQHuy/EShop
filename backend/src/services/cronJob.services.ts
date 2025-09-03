import cron from 'node-cron';
import database from 'database/index.database'
import { Client } from "pg";

async function startRemoveTokenJob() {
    cron.schedule('*/10 * * * *', async () => {
        let db: Client | undefined = undefined;
        try {
            db = await database.getConnection();
            const sql = `
                DELETE FROM tokens
                WHERE expires_at < NOW()
                RETURNING *;
            `;
            const response = await db.query(sql);
            console.log(`Removed ${response.rowCount} expired tokens`);
        } catch (error) {
            console.error("Error removing expired tokens:", error);
        } finally {
            database.releaseConnection(db);
        }
    });
}

async function startRemoveMessageJob() {
    cron.schedule('*/10 * * * *', async () => {
        let db: Client | undefined = undefined;
        try {
            db = await database.getConnection();
            // const sql = `
            //     DELETE FROM messages
            //     WHERE created_at < NOW() - INTERVAL '30 days'
            //     RETURNING *;
            // `;
            // for testing
            const sql = `
                DELETE FROM messages
                WHERE sent_at < NOW() - INTERVAL '10 minutes'
                RETURNING *;
            `;
            const response = await db.query(sql);
            console.log(`Removed ${response.rowCount} expired messages`);
        } catch (error) {
            console.error("Error removing expired messages:", error);
        } finally {
            database.releaseConnection(db);
        }
    });
}

async function startAllCronJobs() {
    await startRemoveTokenJob();
    await startRemoveMessageJob();
}

const cronJobs = {
    startAll: startAllCronJobs
}

export default cronJobs;