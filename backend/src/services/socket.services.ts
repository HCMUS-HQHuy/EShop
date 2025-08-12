import { Server, Socket, DefaultEventsMap } from 'socket.io';
import jwt from "jsonwebtoken";
import * as types from "types/index.types"

let ioInstance : Server | undefined = undefined;

function connect(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    ioInstance = io;
    console.log("Socket Server is running");
    // authen before connecting.
    io.use((socket, next) => {
        console.log("try to connect to server", socket.id);
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided.'));
            }
            const payload = jwt.verify(token, process.env.JWT_SECRET as string);
            const parsed = types.userSchemas.infor.safeParse(payload);
            if (!parsed.success) {
                console.error('Validation failed:', parsed.error.format());
            }
            socket.data.user = parsed.data;
            next();
        } catch (error: any) {
            console.error('Socket authentication failed:', error.message);
            next(new Error('Authentication failed'));
        }
    });
    // connect to socket
    io.on('connection', (socket: Socket) => {
        const user: types.UserInfor = socket.data.user;
        console.log(`🔌 New client connected: ${socket.id} infor: `, user);
        socket.join(`user_room_${user.user_id}`);

        socket.on('disconnect', () => {
            console.log(`✖️ Client disconnected: ${socket.id} for user ${user.user_id}`);
        });
    });
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
    connect,
    sendMessageToUser,
    getInstance
};
export default socket;