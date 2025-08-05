import express from "express";

import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import sellerRoutes from "./seller.routes";
import * as middleware from "../middlewares/index.middleware";

const router: express.Router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from HQH only // used for testing API" });
});

export default function routes(app: express.Application): void {
    const prefixApi = process.env.API_PREFIX as string;
    router.use("/auth", authRoutes);
    router.use("/admin",    middleware.auth,  adminRoutes);
    router.use("/user",     middleware.auth,  userRoutes);
    router.use("/seller",   middleware.auth, sellerRoutes);
    app.use(prefixApi, router);
    console.log("Routes initialized");
}
