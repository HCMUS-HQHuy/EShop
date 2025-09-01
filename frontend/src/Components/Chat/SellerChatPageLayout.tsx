import { useState } from 'react';
import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';

// Dữ liệu giả - sau này sẽ lấy từ API
const mockConversations = [
  { id: 'conv1', withUser: { name: 'Seller John', avatar: 'https://i.pravatar.cc/40?u=seller1' }, lastMessage: 'Yes, it is still available!', timestamp: '10:45 AM', unreadCount: 2, context: { type: 'product', name: 'Classic Leather Watch' } },
  { id: 'conv2', withUser: { name: 'Buyer Jane', avatar: 'https://i.pravatar.cc/40?u=buyer1' }, lastMessage: 'When will my order ship?', timestamp: 'Yesterday', unreadCount: 0, context: { type: 'order', name: 'Order #12345' } },
  { id: 'conv3', withUser: { name: 'Seller Store ABC', avatar: 'https://i.pravatar.cc/40?u=seller2' }, lastMessage: 'Okay, thank you!', timestamp: 'Aug 18', unreadCount: 0, context: { type: 'product', name: 'Wireless Headphones' } },
];

const SellerChatPageLayout = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  return (
    <div className={s.chatPageContainer}>
      <div className={s.chatLayout}>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <ChatWindow
          conversation={selectedConversation}
        />
      </div>
    </div>
  );
};

export default SellerChatPageLayout;