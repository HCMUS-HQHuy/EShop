import express from "express";
import authen from "../routes/authen.routes";
import { authenticateToken } from "../middlewares/auth.middleware";

const app = express.Router();

app.use(express.json());
app.use("/auth", authen);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Authentication route is working" });
});

app.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "This is a protected route" });
});

export default app;
