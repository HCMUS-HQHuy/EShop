import express from "express";
import * as service from "../services/index.services";
import * as types from "../types/index.types";
import * as util from "../utils/index.util";

export async function createSellerAccount(req: types.RequestCustom, res: express.Response) {
    const requestData: types.SellerAccountCreationRequest = {
        user_id: req.user?.user_id as number,
        shop_name: req.body.shop_name,
        shop_description: req.body.shop_description || undefined
    };
    try {
        const validationError = await util.validateSellerAccountCreationRequest(requestData);
    
        if (!validationError.valid) {
            return res.status(400).json({
                message: "Validation error",
                errors: validationError.errors
            });
        }
    } catch (error) {
        console.error("Validation error:", error);
        return res.status(500).json({
            message: "Internal server error during validation"
        });
    }
    try {
        await service.createSellerAccount(requestData);
        return res.status(201).json({
            message: "Seller account created successfully"
        });
    } catch (error) {
        console.error("Error creating seller account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function reviewSellerAccount(req: express.Request, res: express.Response) {
    const data: types.AdminVerifySellerRequest = req.body;
    const validationError = await util.validateAdminRequestUpdateSeller(data);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }
    try {
        await service.updateSellerAccount(data.seller_id, data.status, data.rejection_reason);
        return res.status(200).json({ message: "Seller account updated", sellerId: data.seller_id });
    } catch (error) {
        console.error("Error updating seller account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}