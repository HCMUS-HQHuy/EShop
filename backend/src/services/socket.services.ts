import { Server, Socket, DefaultEventsMap } from 'socket.io';
import jwt from "jsonwebtoken";
import { Client } from 'pg';

import { SOCKET_EVENTS } from 'constants/socketEvents';
import { SOCKET_NAMESPACE } from 'types/index.types';
import { UserInfor, userSchemas } from 'types/index.types';
import database from 'database/index.database';
import * as cookie from 'cookie';

export interface SocketCustom extends Socket{
    user?: UserInfor;
}

let ioInstance : Server | undefined = undefined;

async function auth(socket: SocketCustom, next: (err?: Error) => void) {
    console.log("try to connect to server", socket.id);
    try {
        const cookiesString = socket.handshake.headers.cookie;
        const parsedCookies = cookie.parse(cookiesString as string);
        const token: string|undefined = parsedCookies['auth_jwt'];
        if (token === undefined) {
            console.log("No token found in cookies");
            return next(new Error('Authentication error: No token found.'));
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        const parsed = userSchemas.infor.safeParse(payload);
        if (parsed.success === false) {
            return next(new Error('Authentication error: Invalid token.'));
        }
        socket.user = parsed.data;
        console.log("socket.data.user: ", socket.data.user);
        next();
    } catch (error: any) {
        console.error('Socket authentication failed:', error.message);
        next(new Error('Authentication failed'));
    }
}

async function joinRoom(socket: SocketCustom) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
                SELECT *
                FROM conversations
                WHERE participant1_id = $1 OR participant2_id = $1
            `;
        const result = await db.query(sql, [socket.user?.user_id]);
        const conversations = result.rows;
        const length = conversations.length;
        const BATCH_SIZE = 20;
        for (let i = 0; i < length; i += BATCH_SIZE) {
            const batch = conversations.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (conv) => { 
                socket.join(`room_${conv.id}`);
            }));
        }
    } catch (error) {
        console.log("Error in main namespace connection:", error);
    } finally {
        await database.releaseConnection(db);
    }
}

function connect(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    ioInstance = io;
    console.log("Socket Server is running");
    io.use(auth);
    io.on(SOCKET_EVENTS.CONNECTION, (socket: SocketCustom) => {
        console.log(`🔌 New client connected: ${socket.id} infor: `, socket.user);
        socket.join(`user_room_${socket.user?.user_id}`);
        joinRoom(socket).then(() => {
            console.log(`User ${socket.user?.user_id} joined their rooms`);
        }).catch((error) => {
            console.log("Error joining rooms:", error);
        });
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ Client disconnected: ${socket.id} for user ${socket.user?.user_id}`);
        });
    });
}

function sendMessageToUser(userId: number, event: string, data: any) {
    if (ioInstance === undefined)
        console.log("ioInstance is not initialized\n");
    else {
        console.log(`Sending message to user ${userId} on event ${event} with data:`, data);
        ioInstance.to(`user_room_${userId}`).emit(event, data);
    }
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