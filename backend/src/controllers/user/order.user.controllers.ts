import express from "express";
import services from "../../services/index.services";
import * as types from "../../types/index.types";
import util from "../../utils/index.utils";

// #### ORDER CONTROLLER ####

async function create(req: types.RequestCustom, res: express.Response) {
    if (!util.role.isUser(req.user)) {
        return res.status(403).json(util.response.authorError('users'));
    }
    console.log(req.body);
    const parsedBody = types.OrderSchema.creating.safeParse({
        ...req.body,
        userId: req.user?.user_id
    });
    if (!parsedBody.success) {
        return res
            .status(400)
            .json(util.response.zodValidationError(parsedBody.error));
    }
    const orderData: types.CreatingOrderRequest = parsedBody.data;

    try {
        await services.order.create(orderData);
        return res
            .status(201)
            .json(util.response.success("Order created successfully. Please wait a moment for the system to confirm."));
    } catch (error) {
        return res
            .status(500)
            .json(util.response.internalServerError());
    }
}

// #### EXPORTS ####
const order = {
    create
};
export default order;
