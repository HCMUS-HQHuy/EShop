import * as types from "../types/index.types";

export function createSellerAccount (data: types.SellerAccountCreationRequest) {
    
    return {
        success: true,
        message: "Waiting for acceptance",
        data: {
            user_id: data.user_id,
            shop_name: data.shop_name,
            shop_description: data.shop_description || "No description provided"
        }
    };
}