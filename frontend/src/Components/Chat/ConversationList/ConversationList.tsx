import s from './ConversationList.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/Types/store.ts';
import { setSelectedConversationId } from 'src/ReduxSlice/conversationSlice.tsx';
import { userImg } from 'src/Assets/Images/Images.ts';

const ConversationList = () => {
  const { conversations, selectedConversationId } = useSelector((state: RootState) => state.conversation);
  const dispatch = useDispatch();

  const selectConversationId = (id: number) => {
    if (id === selectedConversationId) return;
    dispatch(setSelectedConversationId(id));
  };

  return (
    <aside className={s.conversationList}>
      <header className={s.header}>
        <h2>Messages</h2>
        <input type="text" placeholder="Search messages..." className={s.searchInput} />
      </header>
      <div className={s.list}>
        {conversations.map(convo => (
          <div 
            key={convo.conversationId} 
            className={`${s.conversationItem} ${selectedConversationId === convo.conversationId ? s.selected : ''}`}
            onClick={() => selectConversationId(convo.conversationId!)}
          >
            <img src={userImg} alt={convo.withUser.username} className={s.avatar} />
            <div className={s.details}>
              <div className={s.nameTimestamp}>
                <span className={s.name}>{convo.withUser.username}</span>
                <span className={s.timestamp}>{convo.lastMessage.timestamp}</span>
              </div>
              <div className={s.messageUnread}>
                <p className={s.lastMessage}>{convo.lastMessage.content}</p>
                {convo.unreadCount > 0 && (
                  <span className={s.unreadBadge}>{convo.unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;