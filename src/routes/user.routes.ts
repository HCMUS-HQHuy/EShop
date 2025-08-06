import express from "express";

import controller from "../controllers/index.controller";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

router.post("/auth/login", controller.auth.validateUser);
router.post("/auth/signup", controller.auth.registerUser);

// router.post("/create-seller-account", authController.createSellerAccount);

// router.post("/products", authController.listProducts);

export default router;