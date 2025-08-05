import * as types from '../types/index.types';

export function getFilterParamsForProducts(req: any): types.ProductParamsRequest  {
    return {
        page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
        sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
        sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
        keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
        filter: {
            created_from: req.query.created_from !== undefined ? String(req.query.created_from) : undefined,
            created_to: req.query.created_to !== undefined ? String(req.query.created_to) : undefined,
            deleted_from: req.query.deleted_from !== undefined ? String(req.query.deleted_from) : undefined,
            deleted_to: req.query.deleted_to !== undefined ? String(req.query.deleted_to) : undefined,
            is_deleted: req.query.is_deleted !== undefined ? Boolean(req.query.is_deleted === "true") : undefined,
            shop_id: req.user?.shop_id !== undefined ? Number(req.user?.shop_id) : undefined,
            status: req.query.status !== undefined ? String(req.query.status) as types.ProductStatus : undefined,
        }
    };
}