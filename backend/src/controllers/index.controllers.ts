import seller from "controllers/seller/index.seller.controllers";
import auth from   "controllers/shared/auth.shared.controllers";
import upload from "controllers/shared/upload.shared.controllers";
import user from   "controllers/user/index.user.controllers";
import admin from  "controllers/admin/index.admin.controllers";
import payment from "controllers/shared/payment.shared.controllers";
import shared from "./shared/index.shared.controllers";

const controller = {
    seller,
    auth,
    user,
    admin,
    payment,
    upload,
    shared
};

export default controller;