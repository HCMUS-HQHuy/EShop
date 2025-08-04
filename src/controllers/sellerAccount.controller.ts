import express from "express";
import * as service from "../services/index.services";
import * as types from "../types/index.types";
import * as util from "../utils/index.util";

export function createSellerAccount(req: types.RequestCustom, res: express.Response) {
    const requestData: types.SellerAccountCreationRequest = {
        user_id: req.user?.user_id as number,
        shop_name: req.body.shop_name,
        shop_description: req.body.shop_description || undefined
    };

    const validationError = util.validateSellerAccountCreationRequest(requestData);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }

    const returnData = service.createSellerAccount(requestData);
    res.status(201).json(returnData);
}