import express from 'express'
import cors from "cors";

function configCors(app: express.Application) {
    app.use(cors({
        origin: process.env.FRONT_END_URL,
        credentials: true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }));
}

export default configCors;