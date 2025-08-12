import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from 'http';
import { Server } from 'socket.io'

import routes from "routes/index.routes";
import seedAdmin from "config/seedAdmin";
import services from "services/index.services";
import seeddb from "config/seeddbfaker";
import qs from "qs";

import mid from "middlewares/index.middlewares";

const app: express.Application = express();
const httpServer: http.Server = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 8220;

app.set('query parser', (str: string) => {
    return qs.parse(str, {});
});

app.use(mid.addSocketIO(io));

seedAdmin().then(() => {
    try {
        // await seeddb(); // Seed database with sample data
        routes(app);
        services.socket.connect(io);
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start httpServer:', error);
        process.exit(1);
    }
});
