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

export async function validateProductFilters(params: types.ProductParamsRequest): Promise<types.ValidationProductResult> {
    const errors: Partial<Record<keyof types.ProductFilterParams, string>> = {};
    
    if (params.filter?.created_from && isNaN(Date.parse(params.filter.created_from))) {
        errors.created_from = 'Invalid date format for created_from';
    }
    
    if (params.filter?.created_to && isNaN(Date.parse(params.filter.created_to))) {
        errors.created_to = 'Invalid date format for created_to';
    }
    
    if (params.filter?.deleted_from && isNaN(Date.parse(params.filter.deleted_from))) {
        errors.deleted_from = 'Invalid date format for deleted_from';
    }
    
    if (params.filter?.deleted_to && isNaN(Date.parse(params.filter.deleted_to))) {
        errors.deleted_to = 'Invalid date format for deleted_to';
    }
    
    if (params.filter?.is_deleted !== undefined && typeof params.filter.is_deleted !== 'boolean') {
        errors.is_deleted = 'is_deleted must be a boolean';
    }
    
    if (params.filter?.shop_id !== undefined && params.filter.shop_id <= 0) {
        errors.shop_id = 'shop_id must be a positive number';
    }

    if (params.filter?.status && !Object.values(types.PRODUCT_STATUS).includes(params.filter.status)) {
        errors.status = 'Invalid product status';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}