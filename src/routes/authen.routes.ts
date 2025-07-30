import express from "express";
import { authenticateUser } from "../controllers/authen.controller";

const authen = express.Router();

authen.post("/login", authenticateUser);

export default authen;
