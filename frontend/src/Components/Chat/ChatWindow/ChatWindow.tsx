import React, { useEffect, useRef, useState } from 'react';
import s from './ChatWindow.module.scss';
import api from 'src/Api/index.api.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/Types/store.ts';
import type { ConversationType, MessageType } from 'src/Types/conversation.ts';
import { addConversation, addMessageToConversation, setSelectedConversationId } from 'src/ReduxSlice/conversationSlice.tsx';
import { formatDateTime } from 'src/Functions/formatting.ts';
import { useNavigate } from 'react-router-dom';
import { userImg } from 'src/Assets/Images/Images.ts';

interface ChatWindowProps {
  conversation: ConversationType | null;
}

const shouldShowTimestamp = (currentMessage: MessageType, previousMessage: MessageType | undefined): boolean => {
  if (!previousMessage) {
    return true;
  }
  const timeDiff = new Date(currentMessage.timestamp!).getTime() - new Date(previousMessage.timestamp!).getTime();
  const minutesDiff = Math.round(timeDiff / 60000);
  return minutesDiff > 15;
};

const ChatPlaceholder = () => (
  <div className={s.placeholder}>
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="25" width="100" height="150" rx="10" fill="#EDECEE" />
      <rect x="55" y="30" width="90" height="10" rx="5" fill="#BDBDBD" />
      <rect x="60" y="50" width="80" height="80" rx="5" fill="#FAFAFA" />
      <circle cx="100" cy="90" r="15" fill="#DB4444" />
      <rect x="75" y="115" width="50" height="5" rx="2.5" fill="#BDBDBD" />
    </svg>
    <h3>Mẹo! Chat giúp làm sáng tỏ thêm thông tin, tăng hiệu quả mua bán</h3>
  </div>
);

const ChatWindow = ({ conversation }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { userRole } = useSelector((state: RootState) => state.global);
  const { messages } = useSelector((state: RootState) => state.conversation.selectedConversation) || { messages: [] };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className={s.chatWindow}>
        <ChatPlaceholder />
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || conversation === null) return;
    if (conversation.conversationId === undefined) {
      const conversationData = await api.chat.createConversation({
        participant2Id: conversation.withUser.userId,
        participant1Role: userRole,
        participant2Role: conversation.withUser.role,
        context: conversation.context
      });
      conversation = conversationData.data.conversation as ConversationType;
      dispatch(addConversation(conversation));
      dispatch(setSelectedConversationId(conversation.conversationId!));
      navigate(`/chats?conversationId=${conversation.conversationId}`, { replace: true });
    }
    const data = {
      content: newMessage,
      conversationId: conversation.conversationId,
      receiverId: conversation.withUser.userId
    }
    api.chat.sendMessage(data);
    dispatch(addMessageToConversation({
      conversationId: conversation.conversationId!,
      sender: 'me',
      content: newMessage
    }));
    setNewMessage('');
  };

  return (
    <div className={s.chatWindow}>
      <header className={s.header}>
        <img src={userImg} alt={conversation.withUser.username} className={s.avatar} />
        <div className={s.userInfo}>
          <span className={s.name}>{conversation.withUser.username}</span>
          <div className={s.context}>
            <span>Regarding:</span>
            <a href="#">{conversation.context.name}</a>
          </div>
        </div>
      </header>

      <div className={s.messageList}>
        {messages.map((msg, index) => {
          const previousMsg = messages[index - 1];
          const showTimestamp = shouldShowTimestamp(msg, previousMsg);

          return (
            <React.Fragment key={`${msg.timestamp}-${index}`}>
              {showTimestamp && (
                <div className={s.timestampGroup}>
                  {formatDateTime(msg.timestamp!, 'timeOnly', 'vi-VN')}
                </div>
              )}
                <div className={`${s.messageWrapper} ${msg.sender === 'me' ? s.sent : s.received}`}>
                  {msg.sender !== 'me' && <img src={userImg} alt="avatar" className={s.messageAvatar} />}
                  <div className={s.bubble}>{msg.content}</div>
                </div>
            </React.Fragment>
              );
        })}
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