import express from "express";
import authenController from "controllers/shared/auth.controllers";

const route = express.Router();

route.post("/login", authenController.login);
route.post("/register", authenController.registerUser);
route.post("/logout", authenController.logout);

export default route;
