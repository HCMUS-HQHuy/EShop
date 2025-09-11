import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import type { USER_ROLE } from "src/Types/common.ts";
import type { ConversationMessageType, ConversationType } from "src/Types/conversation.ts";

const initialState = {
  conversations: [] as ConversationType[],
  selectedConversation: null as ConversationType | null,
  selectedConversationId: null as number | null | undefined,
};

export const conversationFetch = createAsyncThunk(
  "conversation/getConversations",
  async (userRole: USER_ROLE, { rejectWithValue }) => {
      try {
        const response = await api.chat.getConversations(userRole);
        return response.data.conversations;
      } catch(error) {
        console.warn("Error fetching conversations:", error);
        return rejectWithValue(error);
      }
  }
);

const conversationSlice = createSlice({
  initialState,
  name: "conversationSlice",
  reducers: {
    setSelectedConversationId: (state, action: {payload: number | null}) => {
      console.log("Setting selected conversation ID to:", action.payload);
      state.selectedConversationId = action.payload;
      if (action.payload === null) {
        state.selectedConversation = null;
      } else {
        const conversation = state.conversations.find(conv => conv.id === action.payload);
        if (conversation) {
          conversation.unreadCount = 0;
          state.selectedConversation =  conversation;
        }
      }
    },
    setTemporaryConversation: (state, action: {payload: ConversationType}) => {
      state.selectedConversation = action.payload;
    },
    addConversation: (state, action: {payload: ConversationType}) => {
      if (state.conversations.find(conv => conv.id === action.payload.id)) {
        console.warn("Conversation already exists:", action.payload.id);
        return;
      }
      state.conversations.push(action.payload);
      const conversationSet = state.conversations;
      for (let i = conversationSet.length - 1; i > 0; i--) {
          conversationSet[i] = conversationSet[i - 1]!;
      }
      conversationSet[0] = action.payload;
    },
    addMessageToConversation: (state, action: {payload: ConversationMessageType}) => {
        const { conversationId, content, sender } = action.payload;
        console.log("Adding message to conversation:", action.payload);
        const conversationIndex = state.conversations.findIndex(conv => conv.id === conversationId);
        const conversation = conversationIndex !== -1 ? state.conversations[conversationIndex] : null;
        if (conversation) {
          conversation.messages.push({
              sender: sender,
              content: content,
              timestamp: action.payload.timestamp || new Date().toISOString()
          });
          conversation.lastMessage = conversation.messages[conversation.messages.length - 1]!;
          conversation.unreadCount = sender === 'other' ? (conversation.unreadCount || 0) + 1 : conversation.unreadCount || 0;
          if (state.selectedConversationId === conversationId) {
            state.selectedConversation = conversation;
          }
          for (let i = conversationIndex; i > 0; i--) {
            state.conversations[i] = state.conversations[i - 1]!;
          }
          state.conversations[0] = conversation;
        } else console.warn("Conversation not found:", conversationId);
    },
    findConversation: (state, action: {payload: ConversationType}) => {
      const { context, withUser } = action.payload;
      const conversation = state.conversations.find(conv =>
        conv.context === context &&
        conv.withUser.userId === withUser.userId &&
        conv.withUser.role === withUser.role
      );
      if (conversation) {
        state.selectedConversationId = conversation.id;
        state.selectedConversation = conversation;
      } else {
        state.selectedConversationId = null;
        state.selectedConversation = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(conversationFetch.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.selectedConversation = null;
      state.selectedConversationId = null;
      console.log("Conversations fetched:", action);
    });
    builder.addCase(conversationFetch.pending, (state) => {
      console.log("Fetching conversations...");
    });
    builder.addCase(conversationFetch.rejected, (state, action) => {
      console.error("Fetching conversations failed:", action.error);
    });
  }
});

export const { 
  setSelectedConversationId, 
  addMessageToConversation, 
  addConversation, 
  setTemporaryConversation, 
  findConversation 
} = conversationSlice.actions;
export default conversationSlice.reducer;