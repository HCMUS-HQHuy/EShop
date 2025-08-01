import express from "express";
import * as controller from "../controllers/auth.controller";

const auth = express.Router();

auth.post("/login", controller.validateUser);
auth.post("/signup", controller.registerUser);

export default auth;
