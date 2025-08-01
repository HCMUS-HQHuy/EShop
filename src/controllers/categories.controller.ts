import express from "express";
import * as service from "../services/index.services";
import * as types from "../types/index.types";
import * as util from "../utils/index.util";

export async function addCategory(req: express.Request, res: express.Response) {
    const categoryData: types.CategoryUpdate = req.body;
    const validationError = util.validateCategoryInput(categoryData);

    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationError.errors
        });
    }
    try {
        await service.addCategory(categoryData);
        res.status(201).json({
            message: "Category created successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error creating category",
            errors: error.message
        });
    }
    console.log("Category added successfully");
}

export async function getCategories(req: express.Request, res: express.Response) {
    try {
        const params: types.CategoryParamsRequest = {
            page: req.query.page ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
            sortAttribute: req.query.attribute ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
            sortOrder: req.query.order ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
            keywords: req.query.keywords ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string)
        };

        console.log("Fetching categories with params:", params);

        const categories = await service.getCategories(params);
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}
