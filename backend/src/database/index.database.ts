import { Client } from "pg";

// hiện tại db chưa sử dụng pool, chỉ sử dụng client đơn giản để test api
// nếu cần tối ưu hơn có thể sử dụng pool để quản lý kết nối hiệu quả hơn
// việc điều chỉnh chỉ cần thay đổi trong file này - hàm getConnection và releaseConnection

const dbConfig = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
};

async function getConnection(): Promise<Client> {
    console.log("Connecting to database with config:");
    try {
        if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
            throw new Error("Incomplete database configurations");
        }
        const client = new Client(dbConfig);
        await client.connect();
        return client;
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection failed");
    }
}

async function releaseConnection(client: Client|undefined): Promise<void> {
    try {
        await client?.end();
    } catch (error) {
        console.error("Error releasing database connection:", error);
    }
}

// #### EXPORTS ####
const db = {
    getConnection,
    releaseConnection
};
export default db;
