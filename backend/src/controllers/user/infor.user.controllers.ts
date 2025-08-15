import express from "express";
import { RequestCustom } from "types/user.types";
import database from "database/index.database";
import { Client } from "pg";

// #### CONTROLLER FUNCTIONS ####

async function get(req: RequestCustom, res: express.Response) {
    let db: Client | undefined = undefined;

    try {
        const userId = req.user?.user_id;
        db = await database.getConnection();
        const sql = `
            SELECT username, email, address, phone_number
            FROM users
            WHERE user_id = $1
        `;

        const result = await db.query(sql, [userId]);
        const userInfo = result.rows[0];

        res.status(200).json(userInfo);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (db)
            await database.releaseConnection(db);
    }
}

const infor = {
    get
};

export default infor;