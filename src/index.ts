import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.routes";
import seedAdmin from "./config/seedAdmin";

const server = express();
const PORT = process.env.PORT || 8220;

seedAdmin().then(() => {
    routes(server);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
