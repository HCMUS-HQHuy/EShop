import mysql from "mysql2/promise";
import type { Connection, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// https://medium.com/@sushantkadam15/using-environment-variables-in-typescript-with-dotenv-dc0c35939059

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function getConnection(): Promise<Connection> {
    return await mysql.createConnection(db);
}

// async function query<T = RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
//     const connection = await getConnection();
//     const [rows] = await connection.execute<T>(sql, params);
//     await connection.end();
//     return rows;
// }

export { getConnection };
