import express from 'express';
import { USER_ROLE } from '@prisma/client';

import util from 'src/utils/index.utils';
import { RequestCustom } from 'src/types/common.types';

function switchRole(req: RequestCustom, res: express.Response, next: express.NextFunction) {
    // Check if the user is an admin
    if (util.role.isUser(req.user)) {
        if (req.user?.shopId) {
            req.user.role = USER_ROLE.SELLER;
            return next();
        }
    }
    return res.status(403).json({ message: "Forbidden: Only sellers can access this route." });
}

// #### EXPORTS ####

export default switchRole;