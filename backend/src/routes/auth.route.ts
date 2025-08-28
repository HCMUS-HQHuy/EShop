import express from "express";
import authenController from "controllers/shared/auth.controllers";

const route = express.Router();

route.post("/login", authenController.login);
route.post("/register", authenController.registerUser);
route.post("/logout", authenController.logout);
route.post("/forgot-password", authenController.forgotPassword);
route.post("/reset-password", authenController.resetPassword);
route.get("/verify-email", authenController.verifyEmail);

export default route;
