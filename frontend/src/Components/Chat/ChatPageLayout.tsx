import { useEffect, useState } from 'react';
import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';
import type { ConversationType, ConversationMessageType } from 'src/Types/conversation.ts';
import api from 'src/Api/index.api.ts';
import { useLocation } from 'react-router-dom';
import useSocketIO from 'src/Hooks/Socket/useSocketIO.ts';
import type { RootState } from 'src/Types/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToConversation, setConversations } from 'src/Features/conversationSlice.tsx';
import { SOCKET_NAMESPACE, USER_ROLE } from 'src/Types/common.ts';

// Dữ liệu giả - sau này sẽ lấy từ API
// const mockConversations: ConversationsType[] = [
//   { id: 'conv1', withUser: { userId: 1, name: 'Seller John', avatar: 'https://i.pravatar.cc/40?u=seller1' }, lastMessage: 'Yes, it is still available!', timestamp: '10:45 AM', unreadCount: 2, context: { type: 'product', name: 'Classic Leather Watch' } },
//   { id: 'conv2', withUser: { userId: 1, name: 'Buyer Jane', avatar: 'https://i.pravatar.cc/40?u=buyer1' }, lastMessage: 'When will my order ship?', timestamp: 'Yesterday', unreadCount: 0, context: { type: 'order', name: 'Order #12345' } },
//   { id: 'conv3', withUser: { userId: 1, name: 'Seller Store ABC', avatar: 'https://i.pravatar.cc/40?u=seller2' }, lastMessage: 'Okay, thank you!', timestamp: 'Aug 18', unreadCount: 0, context: { type: 'product', name: 'Wireless Headphones' } },
// ];

const ChatPageLayout = () => {
  const { sellerId, shopName, productId, productName } = useLocation().state || {};
  const { conversations, selectedConversationId } = useSelector((state: RootState) => state.conversation);
  const dispatch = useDispatch();
  let selectedConversation: ConversationType | undefined = conversations.find(c => c.id === selectedConversationId);
  if (sellerId) {
    selectedConversation = {
      id: undefined,
      withUser: {
        userId: sellerId, 
        name: shopName,
        role: USER_ROLE.SELLER, 
        avatar: 'https://i.pravatar.cc/40?u=tempuser'
      },
      context: { type: 'product', name: productName },
      lastMessage: { sender: 'other', content: '', timestamp: '' },
      unreadCount: 0,
      messages: []
    }
  };

  const { isOpen, val } = useSocketIO(SOCKET_NAMESPACE.USER);

  useEffect(() => {
    console.log('SocketIO status:', isOpen, val);
    if (isOpen && val) {
      const messageData: ConversationMessageType = val;
      console.log('Received message via SocketIO:', messageData);
      dispatch(addMessageToConversation(messageData));
    }
  }, [isOpen, val]);

  useEffect(() => {
    api.chat.getConversations(USER_ROLE.CUSTOMER).then(response => {
      const conversations: ConversationType[] = response.data.conversations;
      console.log('Conversation list: ', conversations);
      if (!Array.isArray(conversations))
        console.error("Invalid conversations data:");
      dispatch(setConversations(conversations));
    }).catch(error => {
      console.error("Failed to fetch conversations:", error);
    });
  }, []);

  return (
    <div className={s.chatPageContainer}>
      <div className={s.chatLayout}>
        <div className={s.conversationList}>
          <ConversationList />
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