import { z } from 'zod';
import {SORT_ATTRIBUTES, SORT_ORDERS} from 'src/types/index.types';
import { PAGINATION_DEFAULT_PAGE, SORT_ATTRIBUTE, SORT_ORDER } from 'src/constants/globalVariables';

const CategoryUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

const CategoryFilterSchema = z.object({
    createdFrom: z.string().optional(),
    createdTo: z.string().optional(),
    deletedFrom: z.string().optional(),
    deletedTo: z.string().optional(),
    is_deleted: z.boolean().optional(),
}).refine((data) => {
    if (data.createdFrom && data.createdTo) {
        return new Date(data.createdFrom) <= new Date(data.createdTo);
    }
    if (data.deletedFrom && data.deletedTo) {
        return new Date(data.deletedFrom) <= new Date(data.deletedTo);
    }
    return true;
}, {
    message: "Start date cannot be after end date",
});

const CategoryParamsRequestSchema = z.object({
    keywords: z.string().default(''),
    page: z.number().int().positive().default(PAGINATION_DEFAULT_PAGE),
    sortAttribute: z.enum(SORT_ATTRIBUTES, {
        error: `Invalid sort attribute: must be ${SORT_ATTRIBUTES}`,
    }).default(SORT_ATTRIBUTE),
    sortOrder: z.enum(SORT_ORDERS, {
        error: `Invalid sort order: must be ${SORT_ORDERS}`,
    }).default(SORT_ORDER),
    filter: CategoryFilterSchema.optional(),
});

const category = {
    addRequest: CategoryUpdateSchema,
    updateRequest: CategoryUpdateSchema,
    filterRequest: CategoryFilterSchema,
    paramsRequest: CategoryParamsRequestSchema,
};

export default category;
