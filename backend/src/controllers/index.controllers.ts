import seller from "controllers/seller/index.seller.controllers";
import auth from   "controllers/shared/auth.controllers";
import upload from "controllers/shared/upload.controllers";
import user from   "controllers/user/index.user.controllers";
import admin from  "controllers/admin/index.admin.controllers";
import payment from "controllers/shared/payment.controllers";

const controller = {
    seller,
    auth,
    user,
    admin,
    payment,
    upload,
};

export default controller;