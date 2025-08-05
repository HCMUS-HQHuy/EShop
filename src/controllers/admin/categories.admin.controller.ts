import express from "express";
import {adminService as service} from "../../services/index.services";
import * as types from "../../types/index.types";
import * as util from "../../utils/index.util";

export async function addCategory(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can add categories." });
    }

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
        console.log("Fetching categories with query parameters:", req.query);

        const params: types.CategoryParamsRequest = {
            page: req.query.page !== undefined ? Number(req.query.page) : Number(process.env.PAGINATION_DEFAULT_PAGE),
            sortAttribute: req.query.attribute !== undefined ? String(req.query.sortAttribute) : (process.env.SORT_ATTRIBUTE as string),
            sortOrder: req.query.order !== undefined ? String(req.query.sortOrder) : (process.env.SORT_ORDER as string),
            keywords: req.query.keywords !== undefined ? String(req.query.keywords) : (process.env.SEARCH_KEYWORDS as string),
            filter: {
                created_from: req.query.created_from !== undefined ? String(req.query.created_from) : undefined,
                created_to: req.query.created_to !== undefined ? String(req.query.created_to) : undefined,
                deleted_from: req.query.deleted_from !== undefined ? String(req.query.deleted_from) : undefined,
                deleted_to: req.query.deleted_to !== undefined ? String(req.query.deleted_to) : undefined,
                is_deleted: req.query.is_deleted !== undefined ? Boolean(req.query.is_deleted === "true") : undefined
            }
        };

        const validationError = util.validateCategoryFilters(params);

        if (!validationError.valid) {
            return res.status(400).json({
                message: "Validation error",
                errors: validationError.errors
            });
        }

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

export async function updateCategory(req: express.Request, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can update categories." });
    }    
    const categoryName = req.params.name;
    const categoryData: types.CategoryUpdate = req.body;

    if (!categoryName) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const validationError = await util.validateUpdateCategoryInput(categoryName, categoryData);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation update category input error",
            errors: validationError.errors
        });
    }

    try {
        await service.updateCategory(categoryName, categoryData);
        res.status(200).json({
            message: "Category updated successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error updating category",
            errors: error.message
        });
    }
}

export async function deleteCategory(req: types.RequestCustom, res: express.Response) {
    if (util.isAdmin(req) === false) {
        return res.status(403).json({ message: "Forbidden: Only admins can delete categories." });
    }
    const categoryName = req.params.name;
    
    if (!categoryName) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const validationError = await util.validateUpdateCategoryInput(categoryName);
    if (!validationError.valid) {
        return res.status(400).json({
            message: "Validation delete category input error",
            errors: validationError.errors
        });
    }

    try {
        await service.deleteCategory(categoryName, req.user?.user_id as number);
        res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error deleting category",
            errors: error.message
        });
    }
}