import { createSlice } from "@reduxjs/toolkit";
import type { ConversationType } from "src/Types/conversation.ts";

const initialState = {
  conversations: [] as ConversationType[],
  selectedConversationId: null as number | null,
};

const conversationSlice = createSlice({
  initialState,
  name: "conversationSlice",
  reducers: {
    setConversations: (state, action: {payload: ConversationType[]}) => {
      state.conversations = action.payload;
    },
    setSelectedConversationId: (state, action: {payload: number | null}) => {
      state.selectedConversationId = action.payload;
    },
    addMessageToConversation: (state, action: {payload: {conversationId: number, sender: string, message: string}}) => {
        const { conversationId, message, sender } = action.payload;
        const conversation = state.conversations.find(conv => conv.id === conversationId);
        if (conversation) {
            conversation.messages.push({
                sender: sender,
                content: message,
                timestamp: new Date().toISOString()
            });
        } else console.warn("Conversation not found:", conversationId);
    }
  }
});

export const { setConversations, setSelectedConversationId, addMessageToConversation } = conversationSlice.actions;
export default conversationSlice.reducer;