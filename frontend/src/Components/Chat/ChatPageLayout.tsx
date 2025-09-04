import { useEffect, useState } from 'react';
import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';
import type { ConversationType, ConversationMessageType } from 'src/Types/conversation.ts';
import api from 'src/Api/index.api.ts';
import useSocketIO from 'src/Hooks/Socket/useSocketIO.ts';
import type { RootState } from 'src/Types/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToConversation, setConversations } from 'src/Features/conversationSlice.tsx';
import { SOCKET_NAMESPACE, USER_ROLE } from 'src/Types/common.ts';


const ChatPageLayout = () => {
  const { conversations, selectedConversation } = useSelector((state: RootState) => state.conversation);
  const dispatch = useDispatch();
  const { isConnected, message } = useSocketIO();

  useEffect(() => {
    console.log('SocketIO status:', isConnected, message);
    if (isConnected && message) {
      const messageData: ConversationMessageType = message;
      console.log('Received message via SocketIO:', messageData);
      dispatch(addMessageToConversation(messageData));
    }
  }, [isConnected, message]);

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