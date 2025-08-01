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
        const categories = await service.getCategories();
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching categories",
            errors: error.message
        });
    }
}
