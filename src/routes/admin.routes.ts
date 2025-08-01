import express from "express";

import categories from "./categories.routes";

const admin = express.Router();

admin.use(express.json());

admin.use("/categories", categories);

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin - only use for testing" });
});


export default admin;
