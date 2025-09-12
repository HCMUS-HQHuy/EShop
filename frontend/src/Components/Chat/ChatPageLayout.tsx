import ConversationList from './ConversationList/ConversationList.tsx';
import ChatWindow from './ChatWindow/ChatWindow.tsx';
import s from './ChatPageLayout.module.scss';
import type { RootState } from 'src/Types/store.ts';
import { useSelector } from 'react-redux';

const ChatPageLayout = () => {
  const { selectedConversation } = useSelector((state: RootState) => state.conversation);
  
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