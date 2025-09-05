import { z } from 'zod';
import {SORT_ATTRIBUTES, SORT_ORDERS} from 'types/index.types';

const CategoryUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

const CategoryFilterSchema = z.object({
    created_from: z.string().optional(),
    created_to: z.string().optional(),
    deleted_from: z.string().optional(),
    deleted_to: z.string().optional(),
    is_deleted: z.boolean().optional(),
}).refine((data) => {
    if (data.created_from && data.created_to) {
        return new Date(data.created_from) <= new Date(data.created_to);
    }
    if (data.deleted_from && data.deleted_to) {
        return new Date(data.deleted_from) <= new Date(data.deleted_to);
    }
    return true;
}, {
    message: "Start date cannot be after end date",
});

const CategoryParamsRequestSchema = z.object({
    keywords: z.string().default(process.env.SEARCH_KEYWORDS as string),
    page: z.number().int().positive().default(Number(process.env.PAGINATION_DEFAULT_PAGE)),
    sortAttribute: z.enum(SORT_ATTRIBUTES, {
        error: `Invalid sort attribute: must be ${SORT_ATTRIBUTES}`,
    }).default(process.env.SORT_ATTRIBUTE as SORT_ATTRIBUTES),
    sortOrder: z.enum(SORT_ORDERS, {
        error: `Invalid sort order: must be ${SORT_ORDERS}`,
    }).default(process.env.SORT_ORDER as SORT_ORDERS),
    filter: CategoryFilterSchema.optional(),
});

const category = {
    addRequest: CategoryUpdateSchema,
    updateRequest: CategoryUpdateSchema,
    filterRequest: CategoryFilterSchema,
    paramsRequest: CategoryParamsRequestSchema,
};

export default category;
