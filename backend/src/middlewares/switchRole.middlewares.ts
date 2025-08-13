import express from 'express';
import * as utils from 'utils/index.utils';
import * as types from 'types/index.types';

function switchRole(req: types.RequestCustom, res: express.Response, next: express.NextFunction) {
    // Check if the user is an admin
    if (utils.isUser(req)) {
        if (req.user?.shop_id) {
            req.user.role = types.USER_ROLE.SELLER;
            return next();
        }
    }
    return res.status(403).json({ message: "Forbidden: Only sellers can access this route." });
}

// #### EXPORTS ####

export default switchRole;