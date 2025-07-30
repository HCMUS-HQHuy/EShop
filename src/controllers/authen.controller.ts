import express from "express";
import { authenticate } from "../services/authen.services";

export async function authenticateUser(req: express.Request, res: express.Response) {
    const { username, password } = req.body;
    try {
        const token = await authenticate(username, password);
        return res.status(201).json({
            message: "Login successful",
            accessToken: token
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid credentials" });
    }
}
