import * as types from "src/types/index.types";

export function isSeller(user: types.UserInfor | undefined): boolean {
    if (!user || !user.shop_id) {
        return false;
    }
    return true;
}

export function isAcceptedSeller(user: types.UserInfor | undefined): boolean {
    if (!user || !user.shop_status) {
        return false;
    }
    return user.shop_status === types.SHOP_STATUS.ACTIVE || user.shop_status === types.SHOP_STATUS.CLOSED;
}

export function isAdmin(user: types.UserInfor | undefined): boolean {
    if (!user || !user.role) {
        return false;
    }
    return user.role === types.USER_ROLE.ADMIN;
}

export function isUser(user: types.UserInfor | undefined ): boolean {
    if (!user || !user.role) {
        return false;
    }
    return user.role === types.USER_ROLE.USER;
}

export function isGuest(user: types.UserInfor | undefined): boolean {
    return !user;
}

const role = {
    isSeller,
    isAcceptedSeller,
    isAdmin,
    isUser,
    isGuest
}
export default role;