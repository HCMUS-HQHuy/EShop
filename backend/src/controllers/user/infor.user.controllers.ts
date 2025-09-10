import express from "express";

import util from "src/utils/index.utils";
import prisma from "src/models/prismaClient";
import { RequestCustom } from "src/types/index.types";

// #### CONTROLLER FUNCTIONS ####

async function get(req: RequestCustom, res: express.Response) {
    try {
        const userInfo = await prisma.users.findUniqueOrThrow({
            where: { userId: req.user?.userId },
            select: {
                username: true,
                email: true,
                address: true,
                phoneNumber: true
            }
        });
        if (!userInfo) {
            return res.status(404).json(util.response.error('User not found'));
        }
        res.status(200).json(util.response.success('Fetched user info successfully', { userInfor: userInfo }));
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json(util.response.internalServerError());
    }
}

const infor = {
    get
};

export default infor;