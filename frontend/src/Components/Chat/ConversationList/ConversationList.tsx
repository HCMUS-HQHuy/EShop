import type { ConversationsType } from 'src/Types/conversation.ts';
import s from './ConversationList.module.scss';

interface ConversationListProps {
  conversations: ConversationsType[];
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
}

const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) => {
  return (
    <aside className={s.conversationList}>
      <header className={s.header}>
        <h2>Messages</h2>
        <input type="text" placeholder="Search messages..." className={s.searchInput} />
      </header>
      <div className={s.list}>
        {conversations.map(convo => (
          <div 
            key={convo.id} 
            className={`${s.conversationItem} ${selectedConversationId === convo.id ? s.selected : ''}`}
            onClick={() => onSelectConversation(convo.id!)}
          >
            <img src={convo.withUser.avatar} alt={convo.withUser.name} className={s.avatar} />
            <div className={s.details}>
              <div className={s.nameTimestamp}>
                <span className={s.name}>{convo.withUser.name}</span>
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