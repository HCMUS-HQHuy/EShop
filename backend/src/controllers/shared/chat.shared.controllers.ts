import express from 'express';
import util from 'utils/index.utils';
import { Client } from 'pg';
import database from 'database/index.database';
import SOCKET_EVENTS from 'constants/socketEvents';
import { USER_ROLE, ConversationMessageType, RequestCustom } from 'types/index.types';

async function createConversation(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const params = [req.user?.user_id, req.body.participant2Id, req.body.participant1Role, req.body.participant2Role, JSON.stringify(req.body.context)];
        const result = await db.query(`
            INSERT INTO conversations (
                participant1_id,
                participant2_id,
                participant1_role, 
                participant2_role, 
                context,
                created_at
            )
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id
        `, params);

        const data = {
            id: result.rows[0].id,
            withUser: {
                userId: req.body.participant2Id,
                name: req.body.participant2Name,
                role: req.body.participant2Role,
                avatar: `${process.env.STATIC_URL}/defaultavt.png`
            },
            lastMessage: {},
            messages: [],
            unreadCount: 0,
            context: req.body.context
        }
        return res.status(201).json(util.response.success('Conversation created', { conversation: data }));
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
}

async function sendMessage(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    console.log(req.body);
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const { conversationId, receiverId, content } = req.body;

        if (!conversationId || !receiverId || !content) {
            return res.status(400).json(util.response.error('Missing required fields'));
        }

        const sql = `
            INSERT INTO messages (conversation_id, sender_id, content, sent_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING
                conversation_id as "conversationId",
                CASE sender_id
                    WHEN $2 THEN 'other'
                    ELSE 'me'
                END as "sender",
                content,
                sent_at as "timestamp"
        `;
        const result = await db.query(sql, [conversationId, req.user?.user_id, content]);
        const message: ConversationMessageType = result.rows[0];
        const data = {
            conversationId: Number(message.conversationId),
            content: message.content,
            sender: message.sender,
            timestamp: message.timestamp
        }
        req.io?.to(`room_${message.conversationId}`).except(`user_room_${req.user?.user_id}`).emit(SOCKET_EVENTS.MESSAGE, data);
        res.status(201).json(util.response.success('Message sent', { message: data }));
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        await database.releaseConnection(db);
    }
}

async function getConversations(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    const userRole =  req.query.userRole;
    switch (userRole) {
        case USER_ROLE.ADMIN:
            if (!util.role.isAdmin(req.user)) {
                return res.status(403).json(util.response.authorError('admin'));
            }
            break;
        case USER_ROLE.SELLER:
            if (!util.role.isSeller(req.user)) {
                return res.status(403).json(util.response.authorError('sellers'));
            }
            break;
        case USER_ROLE.CUSTOMER:
            if (!util.role.isUser(req.user)) {
                return res.status(403).json(util.response.authorError('customers'));
            }
            break;
        default:
            return res.status(400).json(util.response.error('Invalid user role'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT
                c.id AS "conversationId",
                CASE
                    WHEN c.participant1_id = $1 THEN c.participant2_role
                    ELSE c.participant1_role
                END AS "userRole",
                c.context AS "context",
                withUser.user_id AS "withUserId",
                withUser.username AS "username"
            FROM (SELECT * FROM conversations WHERE (participant1_id = $1 AND participant1_role = $2)  OR (participant2_id = $1 AND participant2_role = $2)) c
            JOIN users withUser ON  withUser.user_id IN (c.participant2_id, c.participant1_id) AND withUser.user_id != $1
            OFFSET 0 LIMIT 10
        `;
        const result = await db.query(sql, [req.user?.user_id, userRole]);
        const data = result.rows.map(row => ({
            id: row.conversationId,
            withUser: {
                userId: row.withUserId,
                name: row.username,
                role: row.userRole,
                avatar: `${process.env.STATIC_URL}/defaultavt.png`
            },
            lastMessage: {},
            messages: [] as any[],
            unreadCount: 0,
            context: row.context
        }));
        for (const conv of data) {
            const sql = `
                SELECT 
                    content,
                    sent_at as "sentAt",
                    is_read as "isRead",
                    CASE
                        WHEN sender_id = $2 THEN 'me'
                        ELSE 'other'
                    END AS "sender"
                FROM messages
                WHERE conversation_id = $1
                ORDER BY sent_at DESC
                OFFSET 0 LIMIT 20
            `;
            const result = await db.query(sql, [conv.id, req.user?.user_id]);
            result.rows.reverse();
            conv.messages = result.rows.map(row => ({
                sender: row.sender,
                content: row.content,
                timestamp: row.sentAt,
                isRead: row.isRead
            }));
            conv.lastMessage = conv.messages[conv.messages.length - 1] || {};
            conv.unreadCount = conv.messages.filter(msg => !msg.isRead && msg.sender === 'other').length;
        }
        res.status(200).json(util.response.success('Success', { conversations: data }));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        if (db) {
            database.releaseConnection(db);
        }
    }
};

async function getConversation(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const params = [req.user?.user_id, req.body.participant2Id, req.body.participant1Role, req.body.participant2Role, JSON.stringify(req.body.context)];
        const result = await db.query(`
            SELECT id, users.username as name
            FROM conversations JOIN users ON users.user_id = conversations.participant2_id
            WHERE 
                participant1_id = $1
                AND participant1_role = $3
                AND participant2_id = $2
                AND participant2_role = $4
                AND context = $5
        `, params);
        if (result.rows.length === 0) {
            return res.status(200).json(util.response.error('Conversation not found'));
        }
        const data = {
            id: result.rows[0].id,
            withUser: {
                userId: req.body.participant2Id,
                name: result.rows[0].name,
                role: req.body.participant2Role,
                avatar: `${process.env.STATIC_URL}/defaultavt.png`
            },
            lastMessage: {},
            messages: [],
            unreadCount: 0,
            context: req.body.context
        }
        console.log(data);
        return res.status(201).json(util.response.success('Conversation created', { conversation: data }));
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    } finally {
        await database.releaseConnection(db);
    }
};

const chat = {
    createConversation,
    getConversation,
    getConversations,
    sendMessage
};

export default chat;