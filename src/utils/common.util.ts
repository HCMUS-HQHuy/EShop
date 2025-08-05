import * as types from "../types/index.types";

export function isSeller(req: types.RequestCustom): boolean {
    if (!req.user || !req.user.role) {
        return false;
    }
    return req.user.role === types.USER_ROLE.SELLER;
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