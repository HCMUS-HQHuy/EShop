import { Client } from "pg";

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function getConnection(): Promise<Client> {
    try {
        if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
            throw new Error("Database configuration is incomplete. Please check your environment variables.");
        }
        const client = new Client(dbConfig);
        await client.connect();
        return client;
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection failed");
    }
}

async function releaseConnection(client: Client): Promise<void> {
    try {
        await client.end();
    } catch (error) {
        console.error("Error releasing database connection:", error);
    }
}

export { getConnection, releaseConnection };
