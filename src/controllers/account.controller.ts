import express from "express";
import * as service from "../services/index.services";
import * as types from "../types/index.types";
import * as util from "../utils/index.util";

// This function handles the creation of a seller account
// It validates the request data and creates a new seller account in the database
// It requires the user to be logged in and have a valid user ID
export async function createSellerAccount(req: types.RequestCustom, res: express.Response) {
    if (util.isUser(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only users have permission to create a seller account." });
    }
    if (util.isSeller(req)) {
        return res.status(403).json({ message: "Forbidden: You already have a seller account." });
    }

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

// This function handles the review of seller accounts by the admin
// It validates the request data and updates the seller account status in the database
// It updates the seller account status and optionally the rejection reason
export async function reviewSellerAccount(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can review seller accounts." });
    }

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

// This function handles the review of user accounts by the admin
// It validates the request data and updates the user status in the database
// It updates the user status to either 'Active' or 'Banned'
export async function reviewUserAccount(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can review user accounts." });
    }

    const data: types.BlockUnblockUserRequest = req.body;
    const validationError = await util.validateBlockUnblockUserRequest(data);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }
    try {
        await service.updateUserStatus(data.user_id, data.status);
        return res.status(200).json({ message: "User account updated", userId: data.user_id });
    } catch (error) {
        console.error("Error updating user account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}