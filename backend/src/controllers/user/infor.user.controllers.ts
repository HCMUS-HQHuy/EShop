import express from "express";
import { RequestCustom } from "src/types/index.types";
import database from "src/database/index.database";
import { Client } from "pg";
import util from "src/utils/index.utils";

// #### CONTROLLER FUNCTIONS ####

async function get(req: RequestCustom, res: express.Response) {
    let db: Client | undefined = undefined;

    try {
        const userId = req.user!.user_id;
        db = await database.getConnection();
        const sql = `
            SELECT username, email, address, phone_number
            FROM users
            WHERE user_id = $1
        `;
        const result = await db.query(sql, [userId]);
        const userInfo = result.rows[0];
        res.status(200).json(util.response.success('Fetched user info successfully', { userInfor: userInfo }));
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        if (db)
            await database.releaseConnection(db);
    }
}

const infor = {
    get
};

export default infor;