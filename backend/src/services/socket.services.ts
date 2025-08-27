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
        if (db) {
            await database.releaseConnection(db);
        }
    }
}

function initializeAdmin(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    const adminNamespace = io.of(SOCKET_NAMESPACE.ADMIN);
    adminNamespace.use(auth);
    adminNamespace.use((socket, next) => {
        if (util.role.isAdmin(socket.data.user)) {
            return next();
        }
        next(new Error('Unauthorized'));
    });
    adminNamespace.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 Admin connected: ${socket.id} infor: `, socket.data.user);
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ Admin disconnected: ${socket.id} for user ${socket.data.user.user_id}`);
        });
    });
}

function initializeSeller(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    const sellerNamespace = io.of(SOCKET_NAMESPACE.SELLER);
    sellerNamespace.use(auth);
    sellerNamespace.use((socket, next) => {
        console.log("check role for seller");
        if (util.role.isSeller(socket.data.user)) {
            return next();
        }
        next(new Error('Unauthorized'));
    });
    sellerNamespace.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 Seller connected: ${socket.id} infor: `, socket.data.user);
        socket.join(`shop_id_${socket.data.user.shop_id}`);
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ Seller disconnected: ${socket.id} for user ${socket.data.user.user_id}`);
        });
    });
}

function initializeUser(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    const adminNamespace = io.of(SOCKET_NAMESPACE.USER);
    adminNamespace.use(auth);
    adminNamespace.use((socket, next) => {
        if (util.role.isUser(socket.data.user)) {
            return next();
        }
        next(new Error('Unauthorized'));
    });
    adminNamespace.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id} infor: `, socket.data.user);
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ User disconnected: ${socket.id} for user ${socket.data.user.user_id}`);
        });
    });
}

function connect(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    ioInstance = io;
    console.log("Socket Server is running");
    io.use(auth);
    io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        console.log(`🔌 New client connected: ${socket.id} infor: `, socket.data.user);
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`✖️ Client disconnected: ${socket.id} for user ${socket.data.user.user_id}`);
        });
    });
    initializeUser(io);
    initializeAdmin(io);
    initializeSeller(io);
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