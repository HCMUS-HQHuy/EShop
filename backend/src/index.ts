import 'dotenv/config'
import express from "express";
import http from 'http';
import { Server } from 'socket.io'

import seedAdmin from "config/seedAdmin";
import seeddb from "config/seeddbfaker";
import configQueryParser from 'config/queryparser.config'
import routes from "routes/index.routes";
import services from "services/index.services";
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

configQueryParser(app);
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
