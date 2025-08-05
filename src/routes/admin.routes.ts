import express from "express";

import {authController, adminController } from "../controllers/index.controller";

const admin = express.Router();

admin.use(express.json());

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});

admin.post("/auth/login", authController.validateUser);
admin.post("/auth/signup", authController.registerUser);

admin.put('/account-management/review-user', adminController.reviewUserAccount);
admin.put('/account-management/review-seller', adminController.reviewSellerAccount);

admin.post('/categories/add', adminController.addCategory);
admin.get('/categories/list', adminController.getCategories);
admin.put('/categories/update/:name', adminController.updateCategory);
admin.delete('/categories/delete/:name', adminController.deleteCategory);

export default admin;
