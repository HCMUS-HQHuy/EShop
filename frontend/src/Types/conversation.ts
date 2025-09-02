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
    id: number | undefined;
    withUser: {
        userId: number;
        name: string;
        role: USER_ROLE;
        avatar: string;
    };
    context: {
        type: string;
        name: string;
    };
    messages: MessageType[];
    lastMessage: MessageType;
    unreadCount: number;
}

export type { ConversationType, MessageType, ConversationMessageType };