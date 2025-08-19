import express from "express";

import controller from "controllers/index.controllers";
import mid from "middlewares/index.middlewares";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

// #### USER ROUTES ####
router.get("/getinfor", mid.auth, controller.user.infor.get);

// #### PRODUCT ROUTES ####
router.get("/products/list",        controller.user.product.list);
router.get("/products/:id",         controller.user.product.getDetailById);
router.get("/products/:id/related", controller.user.product.getRelatedProducts);

// #### CART ROUTES ####
// router.get("/cart",                 mid.auth, controller.user.cart.get);
// router.post("/cart/add",            mid.auth, controller.user.cart.addProduct);
// router.put("/cart/:id/update",      mid.auth, controller.user.cart.updateProduct);
// router.delete("/cart/:id/remove",   mid.auth, controller.user.cart.removeProduct);

// #### ORDER ROUTES ####
// router.get("/orders", mid.auth, controller.user.order.list);
// router.get("/orders/:id", mid.auth, controller.user.order.getDetailById);
router.post("/orders/create", mid.auth, controller.user.order.create);

// #### CATEGORY ROUTES ####
router.get("/categories/list", controller.user.category.get);
// router.get("/categories/toplevel", controller.user.category.getTopLevel);

// #### PAYMENT TEST ####
router.post("/payment/test", (req: any, res: any) => {
    console.log('Payment test:', req.body);
    res.send();
});

export default router;