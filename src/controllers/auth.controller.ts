import express from "express";
import { authenticate } from "../services/auth.services";
import * as types from "../types/index";
import { validateCredentials } from "../utils/validateCredentials";

export async function validateUser(req: express.Request, res: express.Response) {
    const credential: types.UserCredentials = req.body;
    const validationResult = validateCredentials(credential);

    if (!validationResult.valid) {
        return res.status(400).json({ message: "Invalid input", errors: validationResult.errors });
    }

    try {
        const token = await authenticate(credential);
        return res.status(201).json({
            message: "Login successful",
            accessToken: token
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid credentials" });
    }
}
