import seller from "controllers/seller/index.seller.controllers";
import auth from   "controllers/shared/auth.controllers";
import upload from "controllers/shared/upload.controllers";
import user from   "controllers/user/index.user.controllers";
import admin from  "controllers/admin/index.admin.controllers";

const controller = {
    seller,
    auth,
    user,
    admin,
    upload
};

export default controller;