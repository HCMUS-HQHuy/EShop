import express from 'express';
import { PAYMENT_STATUS } from '@prisma/client';
import { RequestCustom } from 'src/types/common.types';
import prisma from 'src/models/prismaClient';

async function announce(req: RequestCustom, res: express.Response) {
    try {
        await prisma.payments.update({
            where: { paymentCode: req.body.paymentCode },
            data: { status: PAYMENT_STATUS.COMPLETED }
        });
        console.log('Payment announced successfully');
    } catch (error) {
        console.log('Update database errors:', error);
    }
    res.send();
}

const payment = {
    announce
};
export default payment;