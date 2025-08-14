import 'dotenv/config'
import express from "express";
import http from 'http';
import { Server } from 'socket.io'
import cors from "cors";
import cookieParser from 'cookie-parser';

import seedAdmin from "config/seedAdmin";
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

app.get('/', (res: any, req: any)=> {
    req.send('hello from hqh');
});

app.use(cors({
    origin: process.env.FRONT_END_URL, // Or specify your allowed origin(s)
    credentials: true, 
    methods: ['GET', 'POST'],
}));

app.use(cookieParser());
app.use(mid.addSocketIO(io));

seedAdmin().then(() => {
    try {
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
