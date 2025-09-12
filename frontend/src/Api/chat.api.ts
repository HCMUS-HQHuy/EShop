import api from "./config.api.ts";

const chat = {
  getConversations: (userRole: string) => api.get(`chat/conversations?userRole=${userRole}`),
  getConversation: (data: { participant2Id: number; participant1Role: string; participant2Role: string; context: {type: string, name: string} }) => api.get(`chat/conversation?participant2Id=${data.participant2Id}&participant1Role=${data.participant1Role}&participant2Role=${data.participant2Role}&context=${JSON.stringify(data.context)}`),
  createConversation: (data: { participant2Id: number; participant1Role: string; participant2Role: string; context: {type: string, name: string} }) => api.post(`chat/conversation`, data),
  sendMessage: (data: { conversationId: number | undefined; receiverId: number; content: string }) => api.post(`chat/messages`, data),
};

export default chat;