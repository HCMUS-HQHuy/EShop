import express from "express";
import { authenticateUser } from "../controllers/auth.controller";

const auth = express.Router();

auth.post("/login", authenticateUser);

export default auth;
