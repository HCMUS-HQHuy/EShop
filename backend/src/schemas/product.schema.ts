import { z } from 'zod';
import {SORT_ATTRIBUTES, SORT_ORDERS} from 'src/types/index.types';
import { PRODUCT_STATUS } from '@prisma/client';
import { PAGINATION_DEFAULT_PAGE } from 'src/constants/globalVariables';

const ProductSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be <= 100 characters'),
    sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be <= 50 characters'),
    shortName: z.string().min(1, 'Short name is required').max(50, 'Short name must be <= 50 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be <= 1000 characters'),
    price: z.coerce.number().nonnegative('Price must be >= 0'),
    discount: z.coerce.number().min(0, 'Discount must be >= 0').max(100, 'Discount must be <= 100').optional(),
    stockQuantity: z.coerce.number().nonnegative('Stock quantity must be >= 0'),
    imageUrl: z.string().optional(),
    status: z.enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE]),
    categories: z.array(z.coerce.number().positive('Category ID must be positive')).max(3, 'Max 3 categories'),
    shopId: z.number().int().positive().optional(),
    deletedImages: z.array(z.string()).max(5, 'Max 5 images can be deleted').optional()
});

const BaseProductFilterSchema = z.object({
    categoriesId: z.optional(z.array(z.coerce.number().positive('Category ID must be positive')).max(3, 'Max 3 categories')),
    min_price: z.coerce.number().min(0).optional(),
    max_price: z.coerce.number().min(0).optional(),
}).refine((data) => {
    if (data.min_price != null && data.max_price != null) {
        return data.min_price <= data.max_price;
    }
    return true;
    }, {
    message: "Minimum price cannot be greater than maximum price",
    path: ["priceRange"],
});

const AdminProductFilterSchema = BaseProductFilterSchema.safeExtend({
    isDeleted: z.boolean().optional(),
    shopId: z.string().optional(),
    status: z.enum(PRODUCT_STATUS).optional()
});

const SellerProductFilterSchema = BaseProductFilterSchema.safeExtend({
    isDeleted: z.never(),
    shopId: z.never(),
    status: z.enum(PRODUCT_STATUS).optional()
});

const UserProductFilterSchema = BaseProductFilterSchema.safeExtend({
    isDeleted: z.never(),
    shopId: z.never(),
    status: z.never()
});

const ProductFilterSchema = z.union([
    AdminProductFilterSchema,
    SellerProductFilterSchema,
    UserProductFilterSchema
]);

const ProductParamsRequestSchema = z.object({
    keywords: z.optional(z.string().min(1, "Keywords must not be empty")).default(''),
    page: z.coerce.number().int().min(1, "Page must be greater than 0").default(PAGINATION_DEFAULT_PAGE),
    sortAttribute: z.enum(SORT_ATTRIBUTES, {
        error: "Invalid sort attribute: must be 'name' or 'created_at'"
    }).default(SORT_ATTRIBUTES.NAME),
    sortOrder: z.enum(SORT_ORDERS, {
        error: "Invalid sort order: must be 'asc' or 'desc'"
    }).default(process.env.SORT_ORDER as SORT_ORDERS),
    filter: ProductFilterSchema.optional()
});


const ProductParamsRequest = z.object({
    keywords: z.string().min(1, "Keywords must not be empty").optional().default(''),
    offset: z.coerce.number().int().min(0, "offset must be greater than or equal 0").default(0),
    limit: z.coerce.number().int().min(1, "Limit must be greater than 0").max(50, "Limit must be less than or equal to 100").default(10),
    sortAttribute: z.enum(SORT_ATTRIBUTES, {
        error: "Invalid sort attribute: must be 'name' or 'created_at'"
    }).default(SORT_ATTRIBUTES.NAME),
    sortOrder: z.enum(SORT_ORDERS, {
        error: "Invalid sort order: must be 'asc' or 'desc'"
    }).default(process.env.SORT_ORDER as SORT_ORDERS),
});

const productSchemas = {
    information: ProductSchema,
    userParams: ProductParamsRequest,
    paramsRequest: ProductParamsRequestSchema,
    userFilter: UserProductFilterSchema,
    sellerFilter: SellerProductFilterSchema,
    adminFilter: AdminProductFilterSchema
};

export default productSchemas;