import express from 'express';
import util from 'utils/index.utils';
import * as types from 'types/index.types';
import { Client } from 'pg';
import database from 'database/index.database';
import SOCKET_EVENTS from 'constants/socketEvents';

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

// async function createConversation(req: types.RequestCustom, res: express.Response) {
//     if (util.role.isGuest(req.user)) {
//         return res.status(403).json(util.response.authorError('admin, sellers, users'));
//     }
//     let db: Client|undefined = undefined;
//     try {
//         db = await database.getConnection();
//         await db.query('BEGIN');

//         const userId: number  = req.user?.user_id!;
//         const otherUserId: number = req.body.otherUserId!;
//         const createConversationSql = `
//             INSERT INTO conversations (id, created_at)
//             VALUES (DEFAULT, NOW())
//             RETURNING id
//         `;
//         const conversationResult = await db.query(createConversationSql);
//         const conversationId: number = conversationResult.rows[0].id;
//         const sql = `
//             INSERT INTO conversation_members (conversation_id, user_id)
//             VALUES ($1, $2), ($1, $3)
//         `;
//         await db.query(sql, [conversationId, userId, otherUserId]);
//         await db.query('COMMIT');
//         res.status(201).json(util.response.success('Created conversation', { conversation: {
//             id: conversationId,
//             createdAt: new Date(),
//             members: [ userId, otherUserId ]
//         } }));
//     } catch (error) {
//         console.error('Error sending message:', error);
//         if (db) await db.query('ROLLBACK');
//         res.status(500).json(util.response.internalServerError());
//     } finally {
//         await database.releaseConnection(db);
//     }
// }

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
            conversationId = await createConversation(req.user?.user_id!, receiverId);
        } else if (conversationId !== resultCheck.rows[0].id) {
            console.error('Conversation ID does not match existing conversation between users');
        }

        const sql = `
            INSERT INTO messages (conversation_id, sender_id, content, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING *
        `;
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
                cm.user_id AS "userId",
                u.username AS "username",
                m.content AS "lastMessage",
                m.created_at AS "lastMessageAt",
                CASE
                    WHEN messagewith.user_id != $1 THEN u.username
                    ELSE 'You'
                END AS "sender"
            FROM conversations c
            JOIN conversation_members cm ON c.id = cm.conversation_id AND cm.user_id = $1
            JOIN conversation_members messagewith ON c.id = messagewith.conversation_id AND messagewith.user_id <> $1
            JOIN messages m ON c.id = m.conversation_id
            JOIN users u ON messagewith.sender_id = u.user_id
            ORDER BY c.id, m.created_at DESC
            OFFSET 0 LIMIT 10
        `;
        const result = await db.query(sql, [req.user?.user_id]);
        const data = result.rows;
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

const chat = {
  getConversations,
  sendMessage
};

export default chat;