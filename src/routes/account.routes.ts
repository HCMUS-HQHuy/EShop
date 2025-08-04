import express from 'express';

import * as controller from '../controllers/index.controller';

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the admin" });
});

router.post('/review-seller', controller.reviewSellerAccount);
router.post('/review-user', controller.reviewUserAccount);

export default router;