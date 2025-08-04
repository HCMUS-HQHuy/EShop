import express from "express";

import product from "./product.routes";
import categories from "./categories.routes";
const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use("/categories", categories);
router.use("/products", product);

export default router;