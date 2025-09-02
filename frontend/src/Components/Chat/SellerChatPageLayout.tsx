import { useEffect, useState } from 'react';
import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';
import type { ConversationType, ConversationsType } from 'src/Types/conversation.ts';
import api from 'src/Api/index.api.ts';
import { useLocation } from 'react-router-dom';

// Dữ liệu giả - sau này sẽ lấy từ API
// const mockConversations: ConversationsType[] = [
//   { id: 'conv1', withUser: { userId: 1, name: 'Seller John', avatar: 'https://i.pravatar.cc/40?u=seller1' }, lastMessage: 'Yes, it is still available!', timestamp: '10:45 AM', unreadCount: 2, context: { type: 'product', name: 'Classic Leather Watch' } },
//   { id: 'conv2', withUser: { userId: 1, name: 'Buyer Jane', avatar: 'https://i.pravatar.cc/40?u=buyer1' }, lastMessage: 'When will my order ship?', timestamp: 'Yesterday', unreadCount: 0, context: { type: 'order', name: 'Order #12345' } },
//   { id: 'conv3', withUser: { userId: 1, name: 'Seller Store ABC', avatar: 'https://i.pravatar.cc/40?u=seller2' }, lastMessage: 'Okay, thank you!', timestamp: 'Aug 18', unreadCount: 0, context: { type: 'product', name: 'Wireless Headphones' } },
// ];

const ChatPageLayout = () => {
  const [conversations, setConversations] = useState<ConversationsType[]>([]);
  const shopId: number | undefined = useLocation().state?.shopId;
  const { sellerId, shopName, productId , productName } = useLocation().state || {};
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  let selectedConversation: ConversationType | undefined = conversations.find(c => c.id === selectedConversationId);
  if (shopId) {
    selectedConversation = {
      id: undefined,
      withUser: { userId: sellerId, name: shopName, avatar: 'https://i.pravatar.cc/40?u=tempuser' },
      context: { type: 'product', name: productName }
    }
  };

  useEffect(()=>{
    api.chat.getConversations().then(response => {
      const conversations: ConversationsType[] = response.data.conversations;
      if (!Array.isArray(conversations))
        console.error("Invalid conversations data:", conversations);
      setConversations(conversations);
    }).catch(error => {
      console.error("Failed to fetch conversations:", error);
    });
  }, []);

  return (
    <div className={s.chatPageContainer}>
      <div className={s.chatLayout}>
        <div className={s.conversationList}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className={s.chatWindow}>
          <ChatWindow
            conversation={selectedConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPageLayout;