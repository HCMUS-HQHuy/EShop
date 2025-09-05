import schemas from 'schemas/index.schema';
import { z } from 'zod';

export type CategoryInfor = {
    categoryId: number;
    iconName: string;
    title: string;
    description: null | string;
    subCategories: CategoryInfor[];
};

export type CategoryAddRequest = z.infer<typeof schemas.category.addRequest>;
export type CategoryFilterRequest = z.infer<typeof schemas.category.filterRequest>;
export type CategoryUpdateRequest = z.infer<typeof schemas.category.updateRequest>;
export type CategoryParamsRequest = z.infer<typeof schemas.category.paramsRequest>;