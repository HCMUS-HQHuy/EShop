import seller from "controllers/seller/index.seller.controllers";
import auth from   "controllers/shared/auth.controllers";
import user from   "controllers/user/index.user.controllers";
import admin from  "controllers/admin/index.admin.controllers";

const controller = {
    seller,
    auth,
    user,
    admin
};

export default controller;