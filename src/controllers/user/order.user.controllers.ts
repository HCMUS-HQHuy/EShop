import express from "express";
import services from "../../services/index.services";
import * as utils from "../../utils/index.utils";
import * as types from "../../types/index.types";

// #### ORDER CONTROLLER ####

async function create(req: types.RequestCustom, res: express.Response) {
    if (!utils.isUser(req)) {
        return res.status(403).json({ message: "Forbidden: User authentication required" });
    }
    if (!req.body) {
        return res.status(400).json({ message: "Bad Request: Invalid order items" });
    } else if (req.body.user_id && req.body.user_id !== req.user?.user_id) {
        return res.status(400).json({ message: "Bad Request: User ID mismatch" });
    }
    req.body.user_id = req.user?.user_id as number;
    const parsedBody = types.OrderSchema.creating.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({  
            error: 'Invalid request body', 
            details: parsedBody.error.format()
        });
    }
    const orderData: types.CreatingOrderRequest = parsedBody.data;
    
    try {
        await services.order.create(orderData);
        res.status(201).json({
            message: "Order created successfully",
            data: orderData
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// #### EXPORTS ####
const order = {
    create
};
export default order;
