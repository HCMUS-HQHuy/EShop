import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.routes";
import seedAdmin from "./config/seedAdmin";
import seeddb from "./config/seeddbfaker";
import qs from "qs";
const server = express();
const PORT = process.env.PORT || 8220;

server.set('query parser', (str: string) => {
  return qs.parse(str, {});
});

seedAdmin().then(async () => {
    // await seeddb(); // Seed database with sample data
    routes(server);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
