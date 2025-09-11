import { useEffect, useState } from 'react';
import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';
import type { ConversationType, ConversationMessageType } from 'src/Types/conversation.ts';
import api from 'src/Api/index.api.ts';
import useSocketIO from 'src/Hooks/Socket/useSocketIO.ts';
import type { AppDispatch, RootState } from 'src/Types/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToConversation, conversationFetch } from 'src/ReduxSlice/conversationSlice.tsx';
import { SOCKET_EVENTS } from 'src/Hooks/Socket/socketEvents.ts';

const ChatPageLayout = () => {
  const { conversations, selectedConversation } = useSelector((state: RootState) => state.conversation);
  
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