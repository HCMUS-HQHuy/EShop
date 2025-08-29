import React, { useState } from 'react';
import s from './ChatWindow.module.scss';

// Định nghĩa props
type Conversation = { id: string; withUser: { name: string; avatar: string; }; context: { type: string; name: string; }; };
interface ChatWindowProps {
  conversation: Conversation | undefined;
}

const ChatWindow = ({ conversation }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');

  // Dữ liệu giả cho tin nhắn trong một cuộc trò chuyện
  const mockMessages = [
    { id: 1, sender: 'other', text: 'Hi, I have a question about the Classic Leather Watch. Is it still available?', timestamp: '10:44 AM' },
    { id: 2, sender: 'me', text: 'Hello! Yes, it is still available!', timestamp: '10:45 AM' },
    { id: 3, sender: 'other', text: 'Great! I would like to purchase it.', timestamp: '10:46 AM' },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // TODO: Gửi tin nhắn mới đến backend qua API hoặc WebSocket
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!conversation) {
    return <div className={s.noChatSelected}><h2>Select a conversation to start messaging</h2></div>;
  }

  return (
    <div className={s.chatWindow}>
      <header className={s.header}>
        <img src={conversation.withUser.avatar} alt={conversation.withUser.name} className={s.avatar} />
        <div className={s.userInfo}>
          <span className={s.name}>{conversation.withUser.name}</span>
          <div className={s.context}>
            <span>Regarding:</span>
            <a href="#">{conversation.context.name}</a>
          </div>
        </div>
      </header>

      <div className={s.messageList}>
        {mockMessages.map(msg => (
          <div key={msg.id} className={`${s.message} ${msg.sender === 'me' ? s.sent : s.received}`}>
            <div className={s.bubble}>{msg.text}</div>
            <span className={s.timestamp}>{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <footer className={s.messageInput}>
        <textarea 
          placeholder="Type your message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </footer>
    </div>
  );
};

export default ChatWindow;