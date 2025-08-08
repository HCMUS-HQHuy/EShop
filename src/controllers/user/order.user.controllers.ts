import express from "express";
import * as utils from "../../utils/index.utils";
import * as types from "../../types/index.types";
// #### ORDER CONTROLLER ####

async function create(req: types.RequestCustom, res: express.Response) {
    if (!utils.isUser(req)) {
        return res.status(403).json({ message: "Forbidden: User authentication required" });
    }
    const userId = req.user?.user_id as number;

    try {

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// #### EXPORTS ####
const order = {
    create
};
export default order;
