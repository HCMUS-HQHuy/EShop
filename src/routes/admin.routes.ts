import express from "express";

import * as controller from "../controllers/index.controller";

const admin = express.Router();

admin.use(express.json());

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});

admin.post("/auth/login", controller.validateUser);
admin.post("/auth/signup", controller.registerUser);

admin.post('/account-management/review-user', controller.reviewUserAccount);
admin.post('/account-management/review-seller', controller.reviewSellerAccount);

admin.post('/categories/add', controller.addCategory);
admin.get('/categories/list', controller.getCategories);
admin.put('/categories/update/:name', controller.updateCategory);
admin.delete('/categories/delete/:name', controller.deleteCategory);

export default admin;
