import api from "./config.api.ts";

const chat = {
  getConversations: () => api.get(`chat/conversations`),
  getConversation: (id: number) => api.get(`chat/conversation/${id}`),
  createConversation: (data: { participant2Id: number; participant1Role: string; participant2Role: string; context: {type: string, name: string} }) => api.post(`chat/conversation/create`, data),
  sendMessage: (data: { conversationId: number | undefined; receiverId: number; content: string }) => api.post(`chat/messages`, data),
};

export default chat;