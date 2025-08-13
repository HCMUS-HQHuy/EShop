import express from "express";

import controller from "controllers/index.controllers";
import mid from "middlewares/index.middlewares";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(mid.auth);

// #### ACCOUNT ROUTES ####
router.post('/account/create', controller.seller.account.create);

// #### PRODUCT ROUTES ####
router.get('/products/list',            mid.switchRole, controller.seller.product.list);
router.post('/products/add',            mid.switchRole, controller.seller.product.add);
router.delete('/products/:id/remove',   mid.switchRole, controller.seller.product.remove);
router.put('/products/:id/update',      mid.switchRole, controller.seller.product.update);
router.put('/products/:id/hide',        mid.switchRole, controller.seller.product.hide);
router.put('/products/:id/display',     mid.switchRole, controller.seller.product.display);


export default router;