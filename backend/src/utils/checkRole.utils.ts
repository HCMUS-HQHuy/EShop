import * as types from "../types/index.types";

export function isSeller(req: types.RequestCustom): boolean {
    if (!req.user || !req.user.shop_id) {
        return false;
    }
    return true;
}

export function isAcceptedSeller(req: types.RequestCustom): boolean {
    if (!req.user || !req.user.shop_status) {
        return false;
    }
    return req.user.shop_status === types.SHOP_STATUS.ACTIVE || req.user.shop_status === types.SHOP_STATUS.CLOSED;
}

export function isAdmin(req: types.RequestCustom): boolean {
    if (!req.user || !req.user.role) {
        return false;
    }
    return req.user.role === types.USER_ROLE.ADMIN;
}

export function isUser(req: types.RequestCustom): boolean {
    if (!req.user || !req.user.role) {
        return false;
    }
    return req.user.role === types.USER_ROLE.USER;
}

export function isGuest(req: types.RequestCustom): boolean {
    return !req.user || !req.user.role;
}

const role = {
    isSeller,
    isAcceptedSeller,
    isAdmin,
    isUser,
    isGuest
}
export default role;