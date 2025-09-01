
interface MessageType {
//   id: number;
  sender: string;
  content: string;
  timestamp: string;
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
}

type ConversationsType = ConversationType & {
    lastMessage: MessageType;
    unreadCount: number;
}

export type {ConversationsType, ConversationType, MessageType};