import seller from "./seller/index.seller.controllers";
import auth from "./auth/index.auth.controllers";
import user from "./user/index.user.controllers";
import admin from "./admin/index.admin.controllers";

const controller = {
    seller,
    auth,
    user,
    admin
};

export default controller;