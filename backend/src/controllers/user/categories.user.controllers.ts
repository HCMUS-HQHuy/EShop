import express from "express";

import prisma from "src/models/prismaClient";
import { CategoryInfor } from "src/types/category.types";
import util from "src/utils/index.utils";

// #### DATABASE FUNCTIONS ####

async function getCategories(parentId: number|null): Promise<CategoryInfor[]> {
    try {
        const currentCategores = await prisma.categories.findMany({
            where: { parentId: parentId, isDeleted: false },
            select: { categoryId: true, iconName: true, title: true, description: true, parentId: true },
        })
        if (currentCategores.length === 0) {
            return [];
        }

        const categories: CategoryInfor[] = Array<CategoryInfor>();
        for (const row of currentCategores) {
            const parentCategory: CategoryInfor = {
                ...row,
                subCategories: await getCategories(row.categoryId)
            };
            categories.push(parentCategory);
        }
        return categories;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

// #### CONTROLLER FUNCTIONS ####

async function getCategoriesController(req: express.Request, res: express.Response) {
    try {
        const categories = await getCategories(null);
        res.status(200).json(util.response.success('Fetched categories successfully', { categories }));
    } catch (error: any) {
        console.error("Error in getCategoriesController:", error);
        res.status(500).json(util.response.internalServerError());
    }
}

const category = {
    get: getCategoriesController
};

export default category;
