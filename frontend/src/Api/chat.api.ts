import api from "./config.api.ts";

const chat = {
  getConversations: () => api.get(`chat/conversations`),
  getConversation: (id: number) => api.get(`chat/conversation/${id}`),
  sendMessage: (data: { conversationId: number | undefined; receiverId: number; content: string }) => api.post(`chat/messages`, data),
};

export default chat;