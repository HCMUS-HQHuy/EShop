import express from "express";

import product from "./product.routes";
import categories from "./categories.routes";
import * as middleware from "../middlewares/index.middleware";
const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(middleware.switchRole);
router.use("/categories", categories);
router.use("/products", product);
export default router;