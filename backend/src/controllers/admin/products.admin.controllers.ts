import express from 'express';
import util from 'src/utils/index.utils';
import schemas from 'src/schemas/index.schema';
import { PRODUCT_STATUS } from '@prisma/client';
import { AdminProductParamsRequest, RequestCustom } from 'src/types/index.types';
import { PAGINATION_LIMIT } from 'src/constants/globalVariables';
import prisma from 'src/models/prismaClient';

// #### HELPER FUNCTIONS ####

async function review(req: RequestCustom, res: express.Response, status: PRODUCT_STATUS) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }
    if (productId <= 0) {
        return res.status(400).send({ error: 'Product ID must be a positive integer' });
    }
    try {
        const cnt = await prisma.products.count({
            where: { productId: productId, isDeleted: false }
        });
        if (cnt <= 0) {
            return res.status(404).send(util.response.error('Product not found'));
        }
        await prisma.products.update({
            where: { productId: productId },
            data: { status: status }
        });
        return res.status(200).send(util.response.success('Product reviewed successfully'));
    } catch (error) {
        console.error('Error reviewing product:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

// #### CONTROLLER FUNCTIONS ####

async function list(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).send(util.response.authorError('admins'));
    }
    const parsedBody = schemas.product.adminParams.safeParse(req.query);
    console.log("Parsed body for listing products:", req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: AdminProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);

    try {
        const products = await prisma.products.findMany({
            where: {
                name: { contains: params.keywords, mode: 'insensitive' },
                status: params.status,
                shopId: params.shopId,
                isDeleted: params.isDeleted,
            },
            orderBy: { [params.sortAttribute]: params.sortOrder },
            skip: (params.offset - 1) * PAGINATION_LIMIT,
            take: params.limit ?? PAGINATION_LIMIT,
        });
        res.status(200).json(util.response.success("Products fetched successfully", { products }));
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).send(util.response.internalServerError());
    }
}

async function reject(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can reject products' });
    }
    return review(req, res, PRODUCT_STATUS.REJECTED);
}

async function approve(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can approve products' });
    }
    return review(req, res, PRODUCT_STATUS.ACTIVE);
}

async function ban(req: RequestCustom, res: express.Response) {
    if (util.role.isAdmin(req.user) === false) {
        return res.status(403).send({ error: 'Forbidden: Only admins can ban products' });
    }
    return review(req, res, PRODUCT_STATUS.BANNED);
}

const product = {
    reject,
    approve,
    ban,
    list
};
export default product;