
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