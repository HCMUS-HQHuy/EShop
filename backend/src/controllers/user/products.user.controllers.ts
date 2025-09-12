import express from 'express';
import util from 'src/utils/index.utils';
import schemas from 'src/schemas/index.schema';
import { PRODUCT_STATUS } from '@prisma/client';
import { RequestCustom, UserProductParamsRequest } from 'src/types/index.types';
import prisma from 'src/models/prismaClient';

// #### CONTROLLERS ####

async function list(req: RequestCustom, res: express.Response) {
    console.log("Received product listing request with query:", req.query);
    const parsedBody = schemas.product.userParams.safeParse(req.query);
    if (!parsedBody.success) {
        return res.status(400).send(util.response.zodValidationError(parsedBody.error));
    }
    const params: UserProductParamsRequest = parsedBody.data;
    console.log("Listing products with params:", params);

    try {
        const limit = params.limit;
        const offset = params.offset;
        const products = await prisma.products.findMany({
            select: {
                productId: true,
                shop: { select: { shopId: true, shopName: true } },
                name: true,
                shortName: true,
                price: true,
                discount: true,
                stockQuantity: true,
                imageUrl: true,
                createdAt: true,
                productCategories: { select: { categoryId: true } }
            },
            where: {
                isDeleted: false,
                status: PRODUCT_STATUS.ACTIVE,
                OR: [
                    { name: { contains: params.keywords, mode: 'insensitive' } },
                    { shortName: { contains: params.keywords, mode: 'insensitive' } },
                    { productCategories: { some: { category: { title: { contains: params.keywords, mode: 'insensitive' } } } } }
                ]

            },
            skip: offset,
            take: limit,
            orderBy: { [params.sortAttribute]: params.sortOrder }
        })
        const numberOfProducts = await prisma.products.count({
            where: { isDeleted: false, status: PRODUCT_STATUS.ACTIVE, name: { contains: params.keywords } }
        });
        res.status(200).send(util.response.success('Products fetched successfully', {
            numberOfProducts,
            products
        }));
    } catch (error) {
        console.error('Error listing products:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

async function getDetailById(req: RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
        return res.status(400).send(util.response.authorError('users'));
    }
    console.log("Fetching product details for ID:", productId);
    if (productId <= 0) {
        return res.status(400).send(util.response.error('ProductId must be a positive number',));
    }

    try {
        const data = await prisma.products.findUnique({
            where: { productId: productId, isDeleted: false, status: PRODUCT_STATUS.ACTIVE },
            select: {
                productId: true,
                name: true,
                shortName: true,
                description: true,
                price: true,
                discount: true,
                stockQuantity: true,
                imageUrl: true,
                shop: { select: { shopId: true, shopName: true, userId: true } },
                productCategories: { select: { categoryId: true } },
                productImages: { select: { imageUrl: true } }
            }
        });
        if (!data) {
            return res.status(404).send(util.response.error('Product not found'));
        }
        const product = {
            ...data,
            img: `${data.imageUrl}`,
            categoryIds: data.productCategories.map((pc) => pc.categoryId),
            additionalImages: data.productImages.map((pi) => `${pi.imageUrl}`)
        };
        res.status(200).send(util.response.success('Product details fetched successfully', { product }));
    } catch (error) {
        console.error('Error fetching product details:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}

async function getRelatedProducts(req: RequestCustom, res: express.Response) {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId) || productId <= 0) {
        return res.status(400).send(util.response.error('Product ID is required and must be a number greater than 0'));
    }
    console.log("Fetching related products for ID:", productId);

    try {
        const product = await prisma.products.findUnique({
            where: { productId: productId },
            select: {
                name: true,
                shortName: true,
                productCategories: { select: { categoryId: true } }
            }
        });

        const numberOfProducts = await prisma.products.count({
            where: {
                productId: { not: productId },
                productCategories: { some: { categoryId: { in: product?.productCategories.map(pc => pc.categoryId) || [] } } },
                isDeleted: false,
                status: PRODUCT_STATUS.ACTIVE,
            },
        });

        const products = await prisma.products.findMany({
            where: {
                productId: { not: productId },
                productCategories: { some: { categoryId: { in: product?.productCategories.map(pc => pc.categoryId) || [] } } },
                isDeleted: false,
                status: PRODUCT_STATUS.ACTIVE,
            },
            select: {
                productId: true,
                shop: { select: { shopId: true, shopName: true } },
                name: true,
                shortName: true,
                price: true,
                discount: true,
                stockQuantity: true,
                imageUrl: true,
                createdAt: true,
            },
            take: 10,
            orderBy: { createdAt: 'desc' }
        })
        return res.status(200).send(util.response.success('Related products fetched successfully', { numberOfProducts, products }));
    } catch (error) {
        console.error('Error fetching related products:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}


async function getProductsByCategory(req: RequestCustom, res: express.Response) {
    const categoryId = Number(req.params.id);
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    if (!categoryId || isNaN(categoryId) || categoryId <= 0 || limit > 100 || limit <= 0 || offset < 0) {
        return res.status(400).send(util.response.error('Category ID is required and must be a number greater than 0'));
    }
    console.log("Fetching related categories for ID:", categoryId);

    try {
        const numberOfProducts = await prisma.products.count({
            where: {
                productCategories: { some: { categoryId: categoryId } },
                isDeleted: false,
                status: PRODUCT_STATUS.ACTIVE,
            },
        });
        const products = await prisma.products.findMany({
            where: {
                productCategories: { some: { categoryId: categoryId } },
                isDeleted: false,
                status: PRODUCT_STATUS.ACTIVE,
            },
            select: {
                productId: true,
                shop: { select: { shopId: true, shopName: true } },
                name: true,
                shortName: true,
                price: true,
                discount: true,
                stockQuantity: true,
                imageUrl: true,
                createdAt: true,
                productCategories: { select: { categoryId: true } }
            },
            skip: offset,
            take: limit,
        });
        return res.status(200).send(util.response.success('Related products fetched successfully', { numberOfProducts, products }));
    } catch (error) {
        console.error('Error fetching related products:', error);
        return res.status(500).send(util.response.internalServerError());
    }
}


// #### EXPORTS ####
const product = {
    list,
    getDetailById,
    getRelatedProducts,
    getProductsByCategory
};
export default product;