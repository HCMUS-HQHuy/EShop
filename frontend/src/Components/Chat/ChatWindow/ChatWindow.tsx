import React, { useEffect, useRef, useState } from 'react';
import s from './ChatWindow.module.scss';
import api from 'src/Api/index.api.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/Types/store.ts';
import type { ConversationType, MessageType } from 'src/Types/conversation.ts';
import { addMessageToConversation } from 'src/Features/conversationSlice.tsx';

interface ChatWindowProps {
  conversation: ConversationType | undefined;
}

const ChatPlaceholder = () => (
  <div className={s.placeholder}>
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="25" width="100" height="150" rx="10" fill="#EDECEE"/>
        <rect x="55" y="30" width="90" height="10" rx="5" fill="#BDBDBD"/>
        <rect x="60" y="50" width="80" height="80" rx="5" fill="#FAFAFA"/>
        <circle cx="100" cy="90" r="15" fill="#DB4444"/>
        <rect x="75" y="115" width="50" height="5" rx="2.5" fill="#BDBDBD"/>
    </svg>
    <h3>Mẹo! Chat giúp làm sáng tỏ thêm thông tin, tăng hiệu quả mua bán</h3>
  </div>
);

const ChatWindow = ({ conversation }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.conversation.conversations.find(c => c.id === conversation?.id)) || { messages: [] };
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className={s.chatWindow}>
        <ChatPlaceholder />
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    console.log(newMessage);
    const data = {
      content: newMessage,
      conversationId: conversation.id,
      receiverId: conversation.withUser.userId
    }
    console.log('Sending message:', data);
    api.chat.sendMessage(data);
    dispatch(addMessageToConversation({
      conversationId: conversation.id!,
      sender: 'me',
      content: newMessage
    }));
    setNewMessage('');
  };

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
        {messages.map(msg => (
          <div key={msg.timestamp} className={`${s.message} ${msg.sender === 'me' ? s.sent : s.received}`}>
            <div className={s.bubble}>{msg.content}</div>
            <span className={s.timestamp}>{msg.timestamp}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
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