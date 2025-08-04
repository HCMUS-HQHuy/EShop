import * as types from '../types/index.types';

export function validateSellerAccountCreationRequest(data: types.SellerAccountCreationRequest): types.ValidationSellerAccountResult {
    const errors: Partial<Record<keyof types.SellerAccountCreationRequest, string>> = {};
    
    if (!data.user_id || typeof data.user_id !== 'number') {
        errors.user_id = "Invalid user ID";
    }

    if (!data.shop_name || typeof data.shop_name !== 'string' || data.shop_name.trim() === "") {
        errors.shop_name = "Shop name is required and must be a non-empty string";
    }
    else if (data.shop_name.length < 3 || data.shop_name.length > 50) {
        errors.shop_name = "Shop name must be between 3 and 50 characters";
    }

    if (data.shop_description && typeof data.shop_description !== 'string') {
        errors.shop_description = "Shop description must be a string if provided";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}