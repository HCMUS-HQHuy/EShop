import { Server, DefaultEventsMap } from "socket.io";
import express from 'express';
import * as types from "src/types/index.types";

function addSocketIO(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    return (req: types.RequestCustom, res: express.Response, next: express.NextFunction) => {
        req.io = io;
        next();
    }
}

export default addSocketIO;