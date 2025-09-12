
type MessageType = {
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

type ConversationMessageType = MessageType & {
    conversationId: number;
}

type ConversationType = {
    conversationId: number | undefined;
    withUser: {
        userId: number;
        name: string;
        avatar: string;
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