import type { USER_ROLE } from "./common.ts";

type MessageType = {
  sender: string;
  content: string;
  timestamp?: string;
}

type ConversationMessageType = MessageType & {
    conversationId: number;
}

type ConversationType = {
    conversationId: number | undefined;
    withUser: {
        userId: number;
        username: string;
        role: USER_ROLE;
    };
    context: {
        productId: number;
        type: string;
        name: string;
    };
    messages: MessageType[];
    lastMessage: MessageType;
    unreadCount: number;
}

export type { ConversationType, MessageType, ConversationMessageType };