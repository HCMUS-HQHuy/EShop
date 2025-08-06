import express from "express";

import controller from "../controllers/index.controllers";

const adminRouter = express.Router();

adminRouter.use(express.json());

adminRouter.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});

adminRouter.post("/auth/login", controller.auth.login);
adminRouter.post("/auth/signup", controller.auth.registerUser);

adminRouter.put('/account-management/review-user', controller.admin.account.reviewUser);
adminRouter.put('/account-management/review-seller', controller.admin.account.reviewSeller);

adminRouter.post('/categories/add', controller.admin.category.add);
adminRouter.get('/categories/list', controller.admin.category.get);
adminRouter.put('/categories/update/:name', controller.admin.category.update);
adminRouter.delete('/categories/delete/:name', controller.admin.category.remove);

adminRouter.get('/products/list', controller.admin.product.list);
adminRouter.put('/products/:id/reject', controller.admin.product.reject);
adminRouter.put('/products/:id/approve', controller.admin.product.approve);
adminRouter.put('/products/:id/ban', controller.admin.product.ban);

export default adminRouter;
