import express from "express";
import authen from "./auth.routes";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import admin from "../routes/admin.routes";

const USER_ROLES: { [key: string]: string } = {
    SELLER: 'Seller',
    BUYER: 'Buyer'
};

const app: express.Router = express.Router();

app.use(express.json());
app.use("/auth", authen);
app.use("/admin", admin);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from HQH" });
});

app.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "This is a protected route" });
});

app.get("/admin/protected", authenticateToken, checkRole([]), (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the admin" });
});

app.get("/buyer/protected", authenticateToken, checkRole([USER_ROLES.BUYER]), (req, res) => {
    res.status(200).json({ message: "This route is accessible only by the buyer and admin" });
});

export default app;
