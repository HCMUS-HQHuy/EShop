import { z } from 'zod';
import * as types from 'types/common';

export const PRODUCT_STATUS = {
    PENDING: 'PendingApproval',
    REJECTED: 'Rejected',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    BANNED: 'Banned'
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

const ProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().nonnegative('Price must be >= 0'),
    stock_quantity: z.number().nonnegative('Stock quantity must be >= 0'),
    image_url: z.string().url('Image URL must be valid').optional(),
    categories_id: z.array(z.coerce.number().positive('Category ID must be positive')).max(3, 'Max 3 categories'),
    shop_id: z.number().int().positive().optional(),
});

const BaseProductFilterSchema = z.object({
    categories_id: z.optional(z.array(z.coerce.number().positive('Category ID must be positive')).max(3, 'Max 3 categories')),
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

const AdminProductFilterSchema = BaseProductFilterSchema.extend({
    is_deleted: z.boolean().optional(),
    shop_id: z.string().optional(),
    status: z.enum(PRODUCT_STATUS).optional()
});

const SellerProductFilterSchema = BaseProductFilterSchema.extend({
    is_deleted: z.never(),
    shop_id: z.never(),
    status: z.enum(PRODUCT_STATUS).optional()
});

const UserProductFilterSchema = BaseProductFilterSchema.extend({
    is_deleted: z.never(),
    shop_id: z.never(),
    status: z.never()
});

const ProductFilterSchema = z.union([
    AdminProductFilterSchema,
    SellerProductFilterSchema,
    UserProductFilterSchema
]);

const ProductParamsRequestSchema = z.object({
    keywords: z.optional(z.string().min(1, "Keywords must not be empty")).default(process.env.SEARCH_KEYWORDS),
    page: z.coerce.number().int().min(1, "Page must be greater than 0").default(Number(process.env.PAGINATION_DEFAULT_PAGE)),
    sortAttribute: z.enum(types.SORT_ATTRIBUTES, {
        error: "Invalid sort attribute: must be 'name' or 'created_at'"
    }).default(process.env.SORT_ATTRIBUTE as types.SortAttribute),
    sortOrder: z.enum(types.SORT_ORDERS, {
        error: "Invalid sort order: must be 'asc' or 'desc'"
    }).default(process.env.SORT_ORDER as types.SortOrder),
    filter: ProductFilterSchema.optional()
});


export type UserProductFilter   = z.infer<typeof UserProductFilterSchema>;
export type SellerProductFilter = z.infer<typeof SellerProductFilterSchema>;
export type AdminProductFilter  = z.infer<typeof AdminProductFilterSchema>;
export type ProductInformation  = z.infer<typeof ProductSchema>;
export type ProductParamsRequest= z.infer<typeof ProductParamsRequestSchema>;
export const productSchemas = {
    information: ProductSchema,
    productParamsRequest: ProductParamsRequestSchema,
    userProductFilter: UserProductFilterSchema,
    sellerProductFilter: SellerProductFilterSchema,
    adminProductFilter: AdminProductFilterSchema
};