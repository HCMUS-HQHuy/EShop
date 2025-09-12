import express from "express";

import controller from "src/controllers/index.controllers";
import mid from "src/middlewares/index.middlewares";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

// #### USER ROUTES ####
router.get("/infor", mid.auth, controller.user.infor.get);

// #### PRODUCT ROUTES ####
router.get("/products",                   controller.user.product.list);
router.get("/products/:id",               controller.user.product.getDetailById);
router.get("/products/:id/related-items", controller.user.product.getRelatedProducts);
router.get("/products/category/:id", controller.user.product.getProductsByCategory);

// #### ORDER ROUTES ####
router.post("/orders", mid.auth, controller.user.order.create);
router.get("/orders", mid.auth, controller.user.order.getAllOrders);

// #### CATEGORY ROUTES ####
router.get("/categories/list", controller.user.category.get);

// #### PAYMENT ROUTES ####
router.post("/payment/announce", controller.user.payment.announce);
router.get("/payment/methods", mid.auth, controller.payment.getAll);

export default router;