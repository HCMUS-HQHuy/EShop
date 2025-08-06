import express from "express";

import auth from "../controllers/auth/index.auth.controller";
import admin from "../controllers/admin/index.admin.controller";

const adminRouter = express.Router();

adminRouter.use(express.json());

adminRouter.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});

adminRouter.post("/auth/login", auth.validateUser);
adminRouter.post("/auth/signup", auth.registerUser);

adminRouter.put('/account-management/review-user', admin.account.reviewUser);
adminRouter.put('/account-management/review-seller', admin.account.reviewSeller);

adminRouter.post('/categories/add', admin.category.add);
adminRouter.get('/categories/list', admin.category.get);
adminRouter.put('/categories/update/:name', admin.category.update);
adminRouter.delete('/categories/delete/:name', admin.category.remove);

export default adminRouter;
