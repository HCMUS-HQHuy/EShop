import express from "express";
import authenticateToken from "../middlewares/auth.middleware";

const admin = express.Router();

admin.use(express.json());

admin.get('/', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Hello admin" });
});

export default admin;
