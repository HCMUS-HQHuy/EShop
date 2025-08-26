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
    name: z.string().min(1, 'Name is required').max(100, 'Name must be <= 100 characters'),
    sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be <= 50 characters'),
    shortName: z.string().min(1, 'Short name is required').max(50, 'Short name must be <= 50 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be <= 1000 characters'),
    price: z.coerce.number().nonnegative('Price must be >= 0'),
    discount: z.coerce.number().min(0, 'Discount must be >= 0').max(100, 'Discount must be <= 100').optional(),
    stock_quantity: z.coerce.number().nonnegative('Stock quantity must be >= 0'),
    mainImage: z.string().url('Image URL must be valid').optional(),
    status: z.enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE]),
    categories: z.array(z.coerce.number().positive('Category ID must be positive')).max(3, 'Max 3 categories'),
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
    }).default('name'),
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