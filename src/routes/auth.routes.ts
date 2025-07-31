import express from "express";
import { validateUser, registerUser } from "../controllers/auth.controller";

const auth = express.Router();

auth.post("/login", validateUser);
auth.post("/signup", registerUser);

export default auth;
