import express from "express";
import { authenticateUser } from "../controllers/auth.controller";

const authen = express.Router();

authen.post("/login", authenticateUser);

export default authen;
