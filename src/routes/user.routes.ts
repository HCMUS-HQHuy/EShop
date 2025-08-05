import express from "express";

import { authController  } from "../controllers/index.controller";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

router.post("/auth/login", authController.validateUser);
router.post("/auth/signup", authController.registerUser);

// router.post("/create-seller-account", authController.createSellerAccount);

// router.post("/products", authController.listProducts);

export default router;