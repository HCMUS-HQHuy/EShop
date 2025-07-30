import express from "express";
import { authenticate } from "../services/authen.services";

export function authenticateUser(req: express.Request, res: express.Response) {
    const { username, password } = req.body;
    const token = authenticate(username, password);
    if (token == null) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(201).json({
        message: "Login successful",
        accessToken: token
    });
}
