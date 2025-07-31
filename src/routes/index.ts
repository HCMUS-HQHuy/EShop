import express from "express";
import auth from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";

import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import sellerRoutes from "./seller.routes";
import * as types from "../types/index";

const router: express.Router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from HQH only // used for testing API" });
});

export default function routes(app: express.Application): void {
    const prefixApi = process.env.API_PREFIX as string;
    router.use("/auth", authRoutes);
    router.use("/admin", auth, checkRole([types.Role.Admin]), adminRoutes);
    router.use("/user", auth, checkRole([types.Role.Buyer]), userRoutes);
    router.use("/seller", auth, checkRole([types.Role.Seller]), sellerRoutes);
    app.use(prefixApi, router);
    console.log("Routes initialized");
}
