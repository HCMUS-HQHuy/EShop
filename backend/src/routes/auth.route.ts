import express from "express";
import authenController from "controllers/auth/index.auth.controllers";

const route = express.Router();

route.post("/login", authenController.login);
route.post("/register", authenController.registerUser);

export default route;
