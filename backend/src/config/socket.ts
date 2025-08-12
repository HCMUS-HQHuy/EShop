import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from "jsonwebtoken";
import * as types from "types/index.types"

let ioInstance : Server | undefined = undefined;

function startServer(httpServer: http.Server) {
    const io = new Server(httpServer, {});
    ioInstance = io;
    console.log("Socket.IO initialized.");
    // authen before connecting.
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided.'));
            }
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as types.UserInfor;
            socket.data.user = payload;
            next();
        } catch (error: any) {
            console.error('Socket authentication failed:', error.message);
            next(new Error('Authentication failed'));
        }
    });
    // connect to socket
    io.on('connection', (socket: Socket) => {
        const user = socket.data.user as types.UserInfor;
        console.log(`🔌 New client connected: ${socket.id} for user ${user.user_id}`);
        socket.join(`user_room_${user.user_id}`);

        socket.on('disconnect', () => {
            console.log(`✖️ Client disconnected: ${socket.id} for user ${user.user_id}`);
        });
    });
    return io;
}

function sendMessageToUser(userId: number, event: string, data: any) {
    if (ioInstance === undefined)
        console.log("ioInstance is not initialized\n");
    else 
        ioInstance.to(`user_room_${userId}`).emit(event, data);
}

function getInstance(): Server {
    if (ioInstance === undefined) {
        console.log("undefined ioInstance");
        throw Error;
    }
    return ioInstance;
}

const socket = {
    startServer,
    sendMessageToUser,
    getInstance
};
export default socket;