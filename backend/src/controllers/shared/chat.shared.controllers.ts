import express from 'express';
import util from 'utils/index.utils';
import * as types from 'types/index.types';
import { Client } from 'pg';
import database from 'database/index.database';
import SOCKET_EVENTS from 'constants/socketEvents';

async function createConversation(db: Client, userId1: number, userId2: number): Promise<number> {
    const result = await db.query(
        'INSERT INTO conversations (participant1_id, participant2_id, created_at) VALUES ($1, $2, NOW()) RETURNING id',
        [userId1, userId2]
    );
    return result.rows[0].id;
}

async function sendMessage(req: types.RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        let { conversationId, receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json(util.response.error('Missing required fields'));
        }

        const resultCheck = await db.query(`
            SELECT id FROM conversations
            WHERE (participant1_id = $1 AND participant2_id = $2) OR (participant1_id = $2 AND participant2_id = $1)
        `, [receiverId, req.user?.user_id]);

        if (resultCheck.rows.length === 0) {
            conversationId = await createConversation(db, req.user?.user_id!, receiverId);
        } else if (conversationId !== resultCheck.rows[0].id) {
            console.error('Conversation ID does not match existing conversation between users');
            conversationId = resultCheck.rows[0].id;
        }

        const sql = `
            INSERT INTO messages (conversation_id, sender_id, content, sent_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING *
        `;
        console.log('Inserting message with conversationId:', conversationId, 'senderId:', req.user?.user_id, 'content:', content);
        const result = await db.query(sql, [conversationId, req.user?.user_id, content]);
        const message = result.rows[0];
        req.io?.to(`user_room_${receiverId}`).emit(SOCKET_EVENTS.MESSAGE, {
            messageId: message.id,
            conversationId: message.conversation_id,
            senderId: message.sender_id,
            content: message.content,
            sentAt: message.created_at
        });
        res.status(201).json(util.response.success('Message sent', { message }));
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        await database.releaseConnection(db);
    }
}

async function getConversations(req: types.RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT DISTINCT ON (c.id)
                c.id AS "conversationId",
                withUser.user_id AS "withUserId",
                withUser.username AS "username",
                m.content AS "lastMessage",
                m.sent_at AS "lastMessageAt",
                m.is_read AS "isRead",
                CASE
                    WHEN m.sender_id != $1 THEN u.username
                    ELSE 'You'
                END AS "sender"
            FROM (SELECT * FROM conversations WHERE participant1_id = $1 OR participant2_id = $1) c
            JOIN users withUser ON  withUser.user_id IN (c.participant2_id, c.participant1_id) AND withUser.user_id != $1
            JOIN messages m ON c.id = m.conversation_id
            JOIN users u ON m.sender_id = u.user_id
            ORDER BY c.id, m.sent_at DESC
            OFFSET 0 LIMIT 10
        `;
        const result = await db.query(sql, [req.user?.user_id]);
        const data = result.rows.map(row => ({
            id: row.conversationId,
            withUser: {
                userId: row.withUserId,
                name: row.username,
                avatar: `${process.env.STATIC_URL}/defaultavt.png`
            },
            lastMessage: {
                sender: row.sender,
                content: row.lastMessage,
                timestamp: row.lastMessageAt
            },
            unreadCount: row.isRead ? 0 : 1,
            context: { type: 'product', name: 'Classic Leather Watch' } // Placeholder context
        }));
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

async function getConversation(req: types.RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    const conversationId: number = parseInt(req.params.sellerId);
    if (!Number.isInteger(conversationId) || conversationId < 1) {
        return res.status(400).json(util.response.error('Invalid conversation ID'));
    }

    let db: Client|undefined = undefined;
    try {
        db = await database.getConnection();
        const sql = `
            SELECT 
                id as "messageId",
                content,
                sender_id as "senderId",
                sent_at as "sentAt",
                is_read as "isRead"
            FROM messages
            WHERE conversation_id = $1
        `;
        const result = await db.query(sql, [conversationId]);
        console.log('Fetched messages for userId', req.user?.user_id, ':', result.rows);
        const data = result.rows.map(row => ({
                id: row.messageId,
                sender: Number(row.senderId) === req.user?.user_id ? 'me' : 'other',
                content: row.content,
                timestamp: row.sentAt,
                isRead: row.isRead
            }));
        res.status(200).json(util.response.success('Success', { messages: data }));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json(util.response.internalServerError());
    } finally {
        if (db) {
            database.releaseConnection(db);
        }
    }
};

const chat = {
    getConversation,
    getConversations,
    sendMessage
};

export default chat;