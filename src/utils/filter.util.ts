import * as types from '../types/index.types';
import * as utils from './index.util';

export function getFilterParamsForProducts(req: types.RequestCustom): types.ProductParamsRequest  {
    const params: types.ProductParamsRequest = {
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
            status: req.query.status !== undefined ? String(req.query.status) as types.ProductStatus : undefined,
        }
    };
    if (params.filter === undefined) {
        params.filter = {};
    }
    params.filter.shop_id = utils.isSeller(req) ? Number(req.user?.shop_id) : undefined;
    params.filter.status  = utils.isUser(req) ? types.PRODUCT_STATUS.ACTIVE: params.filter.status;
    return params;
}