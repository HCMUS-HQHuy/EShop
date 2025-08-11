import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from 'http';
import routes from "routes/index.routes";
import seedAdmin from "config/seedAdmin";
import seeddb from "config/seeddbfaker";
import socket from "sockets/index.sockets";
import qs from "qs";

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const PORT = process.env.PORT || 8220;

app.set('query parser', (str: string) => {
    return qs.parse(str, {});
});

seedAdmin().then(async () => {
    try {
        // await seeddb(); // Seed database with sample data
        socket.init(server);
        routes(app);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
    
});
