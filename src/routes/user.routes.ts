import express from "express";

import * as controller from "../controllers/index.controller";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

router.post("/auth/login", controller.validateUser);
router.post("/auth/signup", controller.registerUser);

router.post("/seller/create-seller-account", controller.createSellerAccount);

export default router;