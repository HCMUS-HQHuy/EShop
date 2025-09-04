import { Server, Socket, DefaultEventsMap } from 'socket.io';
import jwt from "jsonwebtoken";
import { Client } from 'pg';

import { SOCKET_EVENTS } from 'constants/socketEvents';
import { SOCKET_NAMESPACE } from 'types/index.types';
import * as types from "types/index.types"
import util from 'utils/index.utils';
import database from 'database/index.database';
import * as cookie from 'cookie';

let ioInstance : Server | undefined = undefined;

async function auth(socket: Socket, next: (err?: Error) => void) {
    console.log("try to connect to server", socket.id);
    try {
        const cookiesString = socket.handshake.headers.cookie;
        if (!cookiesString) {
            return next(new Error('Authentication error: No cookies found.'));
        }
        const parsedCookies = cookie.parse(cookiesString as string);
        const token: string|undefined = parsedCookies['auth_jwt'];
        if (token === undefined) {
            console.log("No token found in cookies");
            return next(new Error('Authentication error: No token found.'));
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        const parsed = types.userSchemas.infor.safeParse(payload);
        if (parsed.success === false) {
            return next(new Error('Authentication error: Invalid token.'));
        }
        socket.data.user = await getUserInfor(parsed.data.user_id);
        console.log("socket.data.user: ", socket.data.user);
        next();
    } catch (error: any) {
        console.error('Socket authentication failed:', error.message);
        next(new Error('Authentication failed'));
    }
}

async function getUserInfor(userId: number): Promise<types.UserInfor | Error>{
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT u.user_id, u.role, s.shop_id, s.status as shop_status
            FROM users as u
                LEFT JOIN shops as s
                ON u.user_id = s.user_id
            WHERE u.user_id = $1
                AND u.status = '${types.USER_STATUS.ACTIVE}'
        `;
        const result = await db.query(sql, [userId]);
        if (result.rows.length === 0)
            throw new Error('User not found');
        const infor: types.UserInfor = result.rows[0];
        return {
            user_id: infor.user_id,
            role: infor.role,
            shop_id: infor.shop_id,
            shop_status: infor.shop_status
        } as types.UserInfor;
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
}

async function joinRoom(userId: number, socket: Socket) {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
                SELECT *
                FROM conversations
                WHERE participant1_id = $1 OR participant2_id = $1
            `;
        const result = await db.query(sql, [userId]);
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
    io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 New client connected: ${socket.id} infor: `, socket.data.user);
        socket.join(`user_room_${socket.data.user.user_id}`);
        joinRoom(socket.data.user.user_id, socket).then(() => {
            console.log(`User ${socket.data.user.user_id} joined their rooms`);
        }).catch((error) => {
            console.log("Error joining rooms:", error);
        });
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ Client disconnected: ${socket.id} for user ${socket.data.user.user_id}`);
        });
    });
}

function sendMessageToUser(userId: number, event: string, data: any) {
    if (ioInstance === undefined)
        console.log("ioInstance is not initialized\n");
    else {
        console.log(`Sending message to user ${userId} on event ${event} with data:`, data);
        ioInstance.of(SOCKET_NAMESPACE.USER).to(`user_room_${userId}`).emit(event, data);
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