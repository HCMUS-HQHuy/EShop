import express from "express";

import * as middleware from "../middlewares/index.middleware";
import { sellerController } from "../controllers/index.controller";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(middleware.switchRole);

router.get('/products/list', sellerController.listProducts);
// router.get('/products/:id', seller.getProductById);
router.post('/products/add', sellerController.addProduct);
// router.put('/products/:id', seller.updateProduct);
// router.delete('/products/:id', seller.deleteProduct);

export default router;