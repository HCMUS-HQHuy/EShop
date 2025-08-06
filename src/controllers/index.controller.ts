import seller from "./seller/index.seller.controller";
import auth from "./auth/index.auth.controller";
// export * from "./user/index.user.controller";
import admin from "./admin/index.admin.controller";

const controller = {
    seller,
    auth,
    admin
};

export default controller;