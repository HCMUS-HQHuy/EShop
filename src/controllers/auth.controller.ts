import express from "express";
import { login, signup } from "../services/auth.services";
import * as types from "../types/index.types";
import * as util from "../utils/index.utils";

export async function validateUser(req: express.Request, res: express.Response) {
    const credential: types.UserCredentials = req.body;
    const validationResult = util.validateCredentials(credential);

    if (!validationResult.valid) {
        return res.status(400).json({ message: "Invalid input", errors: validationResult.errors });
    }

    try {
        const token = await login(credential);
        return res.status(201).json({
            message: "Login successful",
            accessToken: token
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid credentials" });
    }
}

export async function registerUser(req: express.Request, res: express.Response) {
    const registrationData: types.UserRegistration = req.body;
    const validationResult = util.validateRegistration(registrationData);

    if (!validationResult.valid) {
        return res.status(400).json({ message: "Invalid input", errors: validationResult.errors });
    }

    try {
        await signup(registrationData);
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
}