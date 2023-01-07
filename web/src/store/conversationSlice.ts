import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { createConversation, getConversations } from '../utils/api';
import { CreateConversationFormValues } from '../components/modules/Chat/CreateChatModal/CreateChatModal';
import { UserDocument } from './authSlice';
import { MessageDocument } from './messageSlice';

export interface ConversationDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  type: "private" | "group";
  creator?: UserDocument;
  users?: UserDocument[];
  lastMessageSent?: MessageDocument;
  name?: string;
}

export interface ConversationState {
  loading: boolean;
  conversations: ConversationDocument[];
  type: "private" | "group"
}

const initialState: ConversationState = {
  loading: false,
  type: "private",
  conversations: [],
}

export const getConversationsThunk = createAsyncThunk("conversation/get", async () => getConversations());
export const createConversationThunk = createAsyncThunk("conversation/create", async (values: CreateConversationFormValues) => createConversation(values));
export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversationType: (state, { payload }) => {
      state.type = payload
    },
    updateConversation: (state, { payload }) => {
      state.conversations = state.conversations.map(c => c.id === payload.id ? payload : c);
    },
  },
  extraReducers: (builder) => builder
    .addCase(getConversationsThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getConversationsThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.conversations = action.payload.data.result;
      }
    })
    .addCase(getConversationsThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(createConversationThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(createConversationThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.conversations.unshift(action.payload.data.result);
      }
    })
    .addCase(createConversationThunk.rejected, (state) => {
      state.loading = false;
    })
})

export const { setConversationType, updateConversation } = conversationSlice.actions
export default conversationSlice.reducer;