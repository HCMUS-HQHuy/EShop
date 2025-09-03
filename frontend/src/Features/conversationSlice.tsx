import { createSlice } from "@reduxjs/toolkit";
import type { ConversationMessageType, ConversationType } from "src/Types/conversation.ts";

const initialState = {
  conversations: [] as ConversationType[],
  selectedConversation: null as ConversationType | null,
  selectedConversationId: null as number | null | undefined,
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
      if (action.payload === null) {
        state.selectedConversation = null;
      } else {
        state.selectedConversation = state.conversations.find(conv => conv.id === action.payload) || null;
      }
    },
    setTemporaryConversation: (state, action: {payload: ConversationType}) => {
      state.selectedConversation = action.payload;
    },
    addConversation: (state, action: {payload: ConversationType}) => {
      state.conversations.push(action.payload);
    },
    addMessageToConversation: (state, action: {payload: ConversationMessageType}) => {
        const { conversationId, content, sender } = action.payload;
        console.log("Adding message to conversation:", action.payload);
        const conversation = state.conversations.find(conv => conv.id === conversationId);
        if (conversation) {
            conversation.messages.push({
                sender: sender,
                content: content,
                timestamp: action.payload.timestamp || new Date().toISOString()
            });
        } else console.warn("Conversation not found:", conversationId);
    }
  }
});

export const { setConversations, setSelectedConversationId, addMessageToConversation, addConversation, setTemporaryConversation } = conversationSlice.actions;
export default conversationSlice.reducer;