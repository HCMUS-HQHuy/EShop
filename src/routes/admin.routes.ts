import express from "express";

const admin = express.Router();

admin.use(express.json());

admin.get('/', (req, res) => {
    res.status(200).json({ message: "Hello admin" });
});

export default admin;
