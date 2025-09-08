import seller from "src/controllers/seller/index.seller.controllers";
import auth from   "src/controllers/shared/auth.shared.controllers";
import upload from "src/controllers/shared/upload.shared.controllers";
import user from   "src/controllers/user/index.user.controllers";
import admin from  "src/controllers/admin/index.admin.controllers";
import payment from "src/controllers/shared/payment.shared.controllers";
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