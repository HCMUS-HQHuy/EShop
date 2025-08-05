import express from "express";

import * as middleware from "../middlewares/index.middleware";
import * as controller from "../controllers/index.controller";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(middleware.switchRole);

router.get('/products/list', controller.listProducts);
// router.get('/products/:id', controller.getProductById);
router.post('/products/add', controller.addProduct);
// router.put('/products/:id', controller.updateProduct);
// router.delete('/products/:id', controller.deleteProduct);

export default router;