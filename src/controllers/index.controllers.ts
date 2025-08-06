import seller from "./seller/index.seller.controllers";
import auth from "./auth/index.auth.controllers";
// export * from "./user/index.user.controller";
import admin from "./admin/index.admin.controllers";

const controller = {
    seller,
    auth,
    admin
};

export default controller;