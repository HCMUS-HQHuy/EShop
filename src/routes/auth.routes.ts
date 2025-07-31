import express from "express";
import { validateUser } from "../controllers/auth.controller";

const auth = express.Router();

auth.post("/login", validateUser);

export default auth;
