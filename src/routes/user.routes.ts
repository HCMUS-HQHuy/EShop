import express from "express";

import controller from "../controllers/index.controllers";
import mid from "../middlewares/index.middleware";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the user" });
});

router.get("/products",     controller.user.product.list);
router.get("/products/:id", controller.user.product.getDetailById);

export default router;