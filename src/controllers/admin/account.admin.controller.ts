import express from "express";
import {adminService as service} from "../../services/index.services";
import * as types from "../../types/index.types";
import * as util from "../../utils/index.util";

// This function handles the review of seller accounts by the admin
// It validates the request data and updates the seller account status in the database
// It updates the seller account status and optionally the rejection reason
async function reviewSeller(req: express.Request, res: express.Response) {
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
async function reviewUser(req: express.Request, res: express.Response) {
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

const account = {
    reviewSeller,
    reviewUser
}

export default account;