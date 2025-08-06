import express from "express";
import authenController from "../controllers/auth/index.auth.controller";

const route = express.Router();

route.post("/login", authenController.validateUser);
route.post("/register", authenController.registerUser);

export default route;
