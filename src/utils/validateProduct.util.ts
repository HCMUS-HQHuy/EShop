import * as types from '../types/index.types';

export async function validateProductData(data: types.ProductAddRequest): Promise<types.ValidationProductResult> {
    const errors: Partial<Record<keyof types.ProductAddRequest, string>> = {};
    if (data?.name === undefined || data.name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (data?.price === undefined || data.price < 0) {
        errors.price = 'Price must be a non-negative number';
    }

    if (data?.stock_quantity === undefined || data.stock_quantity < 0) {
        errors.stock_quantity = 'Stock quantity must be a non-negative number';
    }

    if (data?.category_id === undefined || data.category_id <= 0) {
        errors.category_id = 'Category ID must be a positive number';
    }
    return { valid: Object.keys(errors).length === 0, errors };
}

export async function validateProductFilters(req: types.RequestCustom): Promise<types.ValidationProductResult> {
    const errors: Partial<Record<keyof types.ProductFilterParams, string>> = {};

    if (req.query.created_from && isNaN(Date.parse(req.query.created_from as string))) {
        errors.created_from = 'Invalid date format for created_from';
    }

    if (req.query.created_to && isNaN(Date.parse(req.query.created_to as string))) {
        errors.created_to = 'Invalid date format for created_to';
    }

    if (req.query.deleted_from && isNaN(Date.parse(req.query.deleted_from as string))) {
        errors.deleted_from = 'Invalid date format for deleted_from';
    }

    if (req.query.deleted_to && isNaN(Date.parse(req.query.deleted_to as string))) {
        errors.deleted_to = 'Invalid date format for deleted_to';
    }

    if (req.query.is_deleted != undefined && typeof req.query.is_deleted != 'boolean') {
        errors.is_deleted = 'is_deleted must be a boolean';
    }

    if (req.query.shop_id != undefined) {
        if (Number(req.query.shop_id) <= 0) {
            errors.shop_id = 'shop_id must be a positive number';
        }
        else if (req.user?.role != types.USER_ROLE.ADMIN && Number(req.query.shop_id) != req.user?.shop_id) {
            errors.shop_id = 'You do not have permission to access this shop';
        }
    }
    
    if (req.query.status && !Object.values(types.PRODUCT_STATUS).includes(req.query.status as types.ProductStatus)) {
        errors.status = 'Invalid product status';
    }
    else if (req.user?.role == types.USER_ROLE.USER && req.query.status != types.PRODUCT_STATUS.ACTIVE) {
        errors.status = "Shop ID can only be used with ACTIVE products for users";
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
}