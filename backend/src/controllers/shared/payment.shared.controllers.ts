import express from 'express';
import util from 'src/utils/index.utils';

import { RequestCustom } from 'src/types/common.types';
import prisma from 'src/models/prismaClient';

async function getAll(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    try {
        const result = await prisma.paymentMethods.findMany({
            where: { isActive: true },
            orderBy: { code: 'desc' },
            select: {
                paymentMethodId: true,
                code: true,
                name: true,
                img: true,
                link: true
            }
        });
        const data = result.map(row => ({
            id: row.paymentMethodId,
            code: row.code,
            name: row.name,
            img: row.img,
            link: row.link
        }));
        console.log('Payment methods retrieved:', data);
        res.status(200).json(util.response.success('Success', { paymentMethods: data }));
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json(util.response.internalServerError());
    }
}

const paymentMethod = {
  getAll
}

export default paymentMethod;
