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

async function createConversation(userId1: number, userId2: number): Promise<number> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const checkExisting = await db.query(`
            SELECT conversation_id 
            FROM conversations 
            WHERE (participant1_id = $1 AND participant2_id = $2) OR (participant1_id = $2 AND participant2_id = $1)
        `, [userId1, userId2]);
        if (checkExisting.rows.length > 0) {
            return checkExisting.rows[0].conversation_id;
        }
        const result = await db.query(
            'INSERT INTO conversations (participant1_id, participant2_id) VALUES ($1, $2) RETURNING conversation_id',
            [userId1, userId2]
        );
        return result.rows[0].conversation_id;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
}

async function createMessage(senderId: number, conversationId: number, content: string): Promise<void> {
    let db: Client | undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            INSERT INTO messages (sender_id, conversation_id, content, sent_at)
            VALUES ($1, $2, $3, NOW())
        `;
        await db.query(sql, [senderId, conversationId, content]);
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
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
    const userNamespace = io.of(SOCKET_NAMESPACE.USER);
    userNamespace.use(auth);
    userNamespace.use((socket, next) => {
        if (util.role.isUser(socket.data.user)) {
            return next();
        }
        next(new Error('Unauthorized'));
    });
    userNamespace.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id} infor: `, socket.data.user);
        socket.join(`user_room_${socket.data.user.user_id}`);
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

        // socket.on(SOCKET_EVENTS.JOIN_A_CONVERSATION, async (data: { conversationId: number | undefined, userId: number }) => {
        //     if (data.conversationId == undefined) {
        //         data.conversationId = await createConversation(socket.data.user.user_id, data.userId);
        //     }
        //     socket.join(`conversationId-${data.conversationId}`);
        // });

        // socket.on(SOCKET_EVENTS.MESSAGE, async (data: { conversationId: number, content: string }) => {
        //     console.log(`📩 Message from user ${socket.data.user.user_id}:`, data);
        //     await createMessage(socket.data.user.user_id, data.conversationId, data.content);
        //     socket.to(`conversationId-${data.conversationId}`).emit(SOCKET_EVENTS.MESSAGE, { ...data, senderId: socket.data.user.user_id });
        // });

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