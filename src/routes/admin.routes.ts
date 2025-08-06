import express from "express";

import controller from "../controllers/index.controllers";
import mid from "../middlewares/index.middleware";

const adminRouter = express.Router();

adminRouter.use(express.json());

adminRouter.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});

// #### AUTHENTICATION ROUTES ####
adminRouter.post("/auth/login", controller.auth.login);
adminRouter.post("/auth/signup", controller.auth.registerUser);

// #### ACCOUNT MANAGEMENT ROUTES ####
adminRouter.put('/account-management/review-user',   mid.auth, controller.admin.account.reviewUser);
adminRouter.put('/account-management/review-seller', mid.auth, controller.admin.account.reviewSeller);

// #### CATEGORY ROUTES ####
adminRouter.post('/categories/add',            mid.auth, controller.admin.category.add);
adminRouter.get('/categories/list',            mid.auth, controller.admin.category.get);
adminRouter.put('/categories/update/:name',    mid.auth, controller.admin.category.update);
adminRouter.delete('/categories/delete/:name', mid.auth, controller.admin.category.remove);

// #### PRODUCT ROUTES ####
adminRouter.get('/products/list',           mid.auth, controller.admin.product.list);
adminRouter.put('/products/:id/reject',     mid.auth, controller.admin.product.reject);
adminRouter.put('/products/:id/approve',    mid.auth, controller.admin.product.approve);
adminRouter.put('/products/:id/ban',        mid.auth, controller.admin.product.ban);

export default adminRouter;
