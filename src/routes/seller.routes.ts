import express from "express";

import * as middleware from "../middlewares/index.middleware";
import controller from "../controllers/index.controllers";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(middleware.switchRole);

// #### PRODUCT ROUTES ####
router.get('/products/list', controller.seller.product.list);
router.delete('/products/:id/remove', controller.seller.product.remove);
router.put('/products/:id/update', controller.seller.product.update);
router.put('/products/:id/hide', controller.seller.product.hide);
router.put('/products/:id/display', controller.seller.product.display);
router.post('/products/add', controller.seller.product.add);
export default router;