import express from "express";
import routes from "./routes/index";
import dotenv from "dotenv";
dotenv.config();

import seedAdmin from "./config/seedAdmin";

const server = express();
const PORT = process.env.PORT || 3000;

seedAdmin().then(() => {
    server.use("/api", routes);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
