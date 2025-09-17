import express from "express";

import util from "src/utils/index.utils";
import schemas from "src/schemas/index.schema";

import { CategoryAddRequest, CategoryParamsRequest, CategoryUpdateRequest } from "src/types/category.types";
import { RequestCustom } from "src/types/common.types";
import { PAGINATION_LIMIT } from "src/constants/globalVariables";
import prisma from "src/models/prismaClient";

// #### CONTROLLER FUNCTIONS ####

async function add(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }

    const parsedBody = schemas.category.addRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: CategoryAddRequest = parsedBody.data;
    console.log("Listing products with params:", params);
    try {
        const cnt = await prisma.categories.count({
            where: { title: params.name, isDeleted: false }
        });
        if (cnt > 0) {
            return res.status(400).json(util.response.error(
                "Validation error",
                { detail: `Category with name: "${params.name}" already exists` }
            ));
        }
        await prisma.categories.create({
            data: {
                title: params.name,
                iconName: params.iconName,
                description: params.description
            }
        });
        res.status(201).json(util.response.success("Category created successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
    console.log("Category added successfully");
}

async function get(req: RequestCustom, res: express.Response) {
    console.log("Fetching categories with query parameters:", req.query);
    const parsedBody = schemas.category.paramsRequest.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: CategoryParamsRequest = parsedBody.data;
    try {
        const categories = prisma.categories.findMany({
            where: {
                title: { contains: params.keywords, mode: 'insensitive' },
                createdAt: { gte: params.filter?.createdFrom, lte: params.filter?.createdTo },
                deletedAt: { gte: params.filter?.deletedFrom, lte: params.filter?.deletedTo },
                isDeleted: params.filter?.is_deleted
            },
            orderBy: { [params.sortAttribute]: params.sortOrder },
            skip: (params.page - 1) * PAGINATION_LIMIT,
            take: PAGINATION_LIMIT
        });

        res.status(200).json(util.response.success("successfull", { categories }));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

async function update(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }
    const parsedParam = schemas.category.updateRequest.safeParse(req.params);
    if (!parsedParam.success) {
        return res.status(400).send(util.response.zodValidationError(parsedParam.error));
    }
    const parsedBody = schemas.category.updateRequest.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const categoryName = parsedParam.data.name;
    const categoryData: CategoryUpdateRequest = parsedBody.data;

    try {
        const cnt: number = await prisma.categories.count({
            where: { title: categoryName, isDeleted: false }
        });
        if (cnt === 0) {
            return res.status(400).json(util.response.error("Validation error", { detail: `Category with name: "${categoryName}" does not exist` }))
        }
        if (categoryData.name && categoryData.name !== categoryName) {
            const newNameCount = await prisma.categories.count({
                where: { title: categoryData.name, isDeleted: false }
            });
            if (newNameCount > 0) {
                return res.status(400).json(util.response.error("Validation error", { detail: `Category with name: "${categoryData.name}" already exists` }))
            }
        }
        await prisma.categories.update({
            where: { title: categoryName },
            data: { title: categoryData.name, description: categoryData.description }
        })
        res.status(200).json(util.response.success("Category updated successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

async function remove(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).json(util.response.authorError('admins'));
    }
    const parsedParam = schemas.category.updateRequest.safeParse(req.params);
    if (!parsedParam.success) {
        return res.status(400).send(util.response.zodValidationError(parsedParam.error));
    }
    const categoryName = parsedParam.data.name;
    try {
        const cnt = await prisma.categories.count({
            where: { title: categoryName, isDeleted: false }
        });
        if (cnt === 0) {
            return res.status(400).json(util.response.error("Validation error"))
        }
        await prisma.categories.delete({
            where: { title: categoryName }
        })
        res.status(200).json(util.response.success("Category deleted successfully"));
    } catch (error: any) {
        res.status(500).json(util.response.internalServerError());
    }
}

const category = {
    add,
    get,
    update,
    remove
};

export default category;
