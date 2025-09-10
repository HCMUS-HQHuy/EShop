import { SHOP_STATUS, USER_ROLE } from "@prisma/client";
import { UserInfor } from "src/types/user.types";

export function isSeller(user: UserInfor | undefined): boolean {
    if (!user || !user.shop_id) {
        return false;
    }
    return true;
}

export function isAcceptedSeller(user: UserInfor | undefined): boolean {
    if (!user || !user.shop_status) {
        return false;
    }
    return user.shop_status === SHOP_STATUS.ACTIVE || user.shop_status === SHOP_STATUS.CLOSED;
}

export function isAdmin(user: UserInfor | undefined): boolean {
    if (!user || !user.role) {
        return false;
    }
    return user.role === USER_ROLE.ADMIN;
}

export function isUser(user: UserInfor | undefined ): boolean {
    if (!user || !user.role) {
        return false;
    }
    return user.role === USER_ROLE.CUSTOMER;
}

export function isGuest(user: UserInfor | undefined): boolean {
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