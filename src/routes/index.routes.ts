import express from "express";

import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import sellerRoutes from "./seller.routes";
import authen from "./auth.route";

const router: express.Router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from HQH only // used for testing API" });
});

export default function routes(app: express.Application): void {
    const prefixApi = process.env.API_PREFIX as string;
    router.use("/auth", authen);
    router.use("/admin", adminRoutes);
    router.use("/user", userRoutes);
    router.use("/seller", sellerRoutes);
    app.use(prefixApi, router);
    console.log("Routes initialized");
}