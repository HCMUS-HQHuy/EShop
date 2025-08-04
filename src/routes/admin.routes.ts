import express from "express";

import categories from "./categories.routes";
import sellerManagement from "./sellerManagement.routes";

const admin = express.Router();

admin.use(express.json());

admin.use("/categories", categories);
admin.use("/seller-management", sellerManagement);

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});


export default admin;
