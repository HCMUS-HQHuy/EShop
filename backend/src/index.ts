import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from 'http';
import socket from 'config/socket'
import routes from "routes/index.routes";
import seedAdmin from "config/seedAdmin";
import seeddb from "config/seeddbfaker";
import * as types from "types/index.types"
import qs from "qs";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io = socket.startServer(server);
const PORT = process.env.PORT || 8220;

app.set('query parser', (str: string) => {
    return qs.parse(str, {});
});

// assign socket to requestCustom
app.use((req: types.RequestCustom, res: express.Response, next: express.NextFunction)=> {
    req.io = io;
    next();
});

seedAdmin().then(async () => {
    try {
        // await seeddb(); // Seed database with sample data
        routes(app);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
});
