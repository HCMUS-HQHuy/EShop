import express from "express";

import controller from "controllers/index.controllers";
import mid from "middlewares/index.middlewares";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the seller and admin" });
});

router.use(mid.auth);

// #### SHOP ROUTES ####
router.post('/shop/create', controller.seller.shop.create);
router.get('/shop/getinformation', controller.seller.shop.getInformation);


// #### PRODUCT ROUTES ####
router.get('/products/list',            mid.switchRole, controller.seller.product.list);
router.get('/products/:id',             mid.switchRole, controller.seller.product.getById);
router.post('/products/add',            mid.switchRole, mid.upload.addProduct, controller.seller.product.add);
router.delete('/products/:id/delete',   mid.switchRole, controller.seller.product.remove);
router.put('/products/:id/update',      mid.switchRole, mid.upload.addProduct, controller.seller.product.update);
router.put('/products/:id/hide',        mid.switchRole, controller.seller.product.hide);
router.put('/products/:id/display',     mid.switchRole, controller.seller.product.display);

// #### ORDER ROUTES ####
router.get('/orders', mid.switchRole, controller.seller.order.fetchList);


export default router;