import { z } from 'zod';
import * as types from './common';

const CategorySchema = z.object({
    name: z.string().min(3, 'Name is required'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
    created_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    })
});

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
    sortAttribute: z.enum(types.SORT_ATTRIBUTES, {
        error: `Invalid sort attribute: must be ${types.SORT_ATTRIBUTES.join(' or ')}`,
    }).default(process.env.SORT_ATTRIBUTE as types.SortAttribute),
    sortOrder: z.enum(types.SORT_ORDERS, {
        error: `Invalid sort order: must be ${types.SORT_ORDERS.join(' or ')}`,
    }).default(process.env.SORT_ORDER as types.SortOrder),
    filter: CategoryFilterSchema.optional(),
});

export type CategoryInformation = z.infer<typeof CategorySchema>;
export type CategoryAddRequest = z.infer<typeof CategoryUpdateSchema>;
export type CategoryFilterRequest = z.infer<typeof CategoryFilterSchema>;
export type CategoryUpdateRequest = z.infer<typeof CategoryUpdateSchema>;
export type CategoryParamsRequest = z.infer<typeof CategoryParamsRequestSchema>;
export const categorySchemas = {
    information: CategorySchema,
    addRequest: CategoryUpdateSchema,
    updateRequest: CategoryUpdateSchema,
    filterRequest: CategoryFilterSchema,
    paramsRequest: CategoryParamsRequestSchema,
};