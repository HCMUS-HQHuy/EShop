import express from 'express';
import util from 'src/utils/index.utils';
import SOCKET_EVENTS from 'src/constants/socketEvents';
import { RequestCustom } from 'src/types/index.types';
import { USER_ROLE } from '@prisma/client';
import prisma from 'src/models/prismaClient';

async function createConversation(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    try {
        const conversation = await prisma.conversations.create({
            data: {
                participant1Id: req.user?.userId!,
                participant2Id: req.body.participant2Id,
                participant1Role: req.body.participant1Role,
                participant2Role: req.body.participant2Role,
                context: JSON.stringify(req.body.context),
                createdAt: new Date()
            },
            select: {
                conversationId: true,
                participant2: {select: {userId: true, username: true, role: true}},
                context: true
            }
        });

        const data = {
            conversationId: conversation.conversationId,
            withUser: conversation.participant2,
            lastMessage: {},
            messages: [],
            unreadCount: 0,
            context: conversation.context ? JSON.parse(String(conversation.context)) : {}
        }
        req.io?.to(`user_room_${req.body.participant2Id}`).emit(SOCKET_EVENTS.NEW_CONVERSATION, { newConversation: data });
        return res.status(201).json(util.response.success('Conversation created', { conversation: data }));
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
}

async function sendMessage(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    console.log(req.body);
    try {
        const { conversationId, content } = req.body;

        if (!conversationId || !content) {
            return res.status(400).json(util.response.error('Missing required fields'));
        }

        const message = await prisma.messages.create({
            data: {
                conversationId: conversationId,
                senderId: req.user?.userId!,
                content: content,
                sentAt: new Date(),
                isRead: false
            },
            select: {
                conversationId: true,
                content: true,
                sentAt: true
            }
        });
        req.io?.to(`room_${message.conversationId}`).except(`user_room_${req.user?.userId}`).emit(SOCKET_EVENTS.MESSAGE, message);
        res.status(201).json(util.response.success('Message sent', { message }));
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json(util.response.internalServerError());
    }
}

async function getConversations(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }
    const userRole = req.query.userRole;
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
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit <= 0) {
        return res.status(400).json(util.response.error('Invalid pagination parameters'));
    }
    try {
        const userId = req.user?.userId;
        const conversations = await prisma.$queryRaw`
            SELECT
                c."conversationId",
                CASE
                WHEN c."participant1Id" = ${userId} THEN c."participant2Role"
                ELSE c."participant1Role"
                END AS "userRole",
                c."context",
                u."userId" AS "withUserId",
                u."username"
            FROM (
                SELECT * FROM "Conversations"
                WHERE ("participant1Id" = ${userId} AND "participant1Role" = ${userRole})
                OR ("participant2Id" = ${userId} AND "participant2Role" = ${userRole})
            ) c
            JOIN "Users" u
                ON u."userId" IN (c."participant1Id", c."participant2Id")
            AND u."userId" != ${userId}
            LEFT JOIN LATERAL (
                SELECT m."sentAt"
                FROM "Messages" m
                WHERE m."conversationId" = c."conversationId"
                ORDER BY m."sentAt" DESC
                LIMIT 1
            ) lm ON TRUE
            ORDER BY lm."sentAt" DESC NULLS LAST
            OFFSET ${offset}
            LIMIT ${limit};
        `;
        for (const conv of conversations as any) {
            const result = await prisma.messages.findMany({
                where: { conversationId: conv.conversationId },
                select: { content: true, sentAt: true, isRead: true, senderId: true },
                orderBy: { sentAt: 'desc' },
                take: 20
            });
            conv.withUser = {
                userId: conv.withUserId,
                username: conv.username,
                role: conv.userRole
            }
            conv.messages = result.map(mess => ({
                sender: mess.senderId === userId ? 'me' : 'other',
                content: mess.content,
                timestamp: mess.sentAt,
                isRead: mess.isRead!,
            }));
            conv.messages.reverse();
            conv.lastMessage = conv.messages[conv.messages.length - 1] || {};
            conv.unreadCount = conv.messages.filter((msg: any) => !msg.isRead && msg.sender === 'other').length;
        }
        res.status(200).json(util.response.success('Success', { conversations }));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json(util.response.internalServerError());
    }
};

async function getConversationByInfor(req: RequestCustom, res: express.Response) {
    if (util.role.isGuest(req.user)) {
        return res.status(403).json(util.response.authorError('admin, sellers, users'));
    }

    const { participant2Id, participant1Role, participant2Role, context } = req.query;
    if (!participant2Id || !participant1Role || !participant2Role || !context) {
        return res.status(400).json(util.response.error('Missing required fields'));
    }

    try {
        const data = await prisma.conversations.findFirst({
            where: {
                participant1Id: Number(req.user?.userId),
                participant1Role: String(participant1Role),
                participant2Id: Number(participant2Id),
                participant2Role: String(participant2Role),
            },
            select: {
                conversationId: true,
                participant1: {select: {userId: true, username: true, role: true}}, 
                participant2: {select: {userId: true, username: true, role: true}}, 
                context: true
            }
        });

        if (!data) {
            return res.status(200).json(util.response.success('Conversation not found', { conversation: null }));
        }
        const conversation = {
            ...data,
            withUser: data.participant1.userId === req.user?.userId ? data.participant2 : data.participant1,
            lastMessage: {},
            messages: [],
            unreadCount: 0,
            context: JSON.parse(String(data.context))
        }
        console.log(data);
        return res.status(201).json(util.response.success('Conversation created', { conversation }));
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};

const chat = {
    createConversation,
    getConversationByInfor,
    getConversations,
    sendMessage
};

export default chat;