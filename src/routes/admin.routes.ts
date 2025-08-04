import express from "express";

import categories from "./categories.routes";
import accountManagement from "./accountManagement.routes";

const admin = express.Router();

admin.use(express.json());

admin.use("/categories", categories);
admin.use("/account-management", accountManagement);

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});


export default admin;
