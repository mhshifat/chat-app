import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { addConversationPerticipent, createConversation, getConversations, removeConversationPerticipent } from '../utils/api';
import { CreateConversationFormValues } from '../components/modules/Chat/CreateChatModal/CreateChatModal';
import { UserDocument } from './authSlice';
import { MessageDocument } from './messageSlice';
import { AddChatParticipentParams } from '../components/modules/Chat/ChatParticipents/AddChatParticipantModal';

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
export const addConversationPerticipentThunk = createAsyncThunk("conversation/participents/add", async (values: AddChatParticipentParams) => addConversationPerticipent(values));
export const removeConversationPerticipentThunk = createAsyncThunk("conversation/participents/remove", async (values: AddChatParticipentParams) => removeConversationPerticipent(values.participentId, values.conversationId));
export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversationType: (state, { payload }) => {
      state.type = payload
    },
    addConversation: (state, { payload }) => {
      state.conversations.unshift(payload);
      state.conversations.sort((a, b) => new Date(b!.lastMessageSent!.created_at!).getTime() < new Date(a!.lastMessageSent!.created_at!).getTime() ? -1 : 1);
    },
    updateConversation: (state, { payload }) => {
      state.conversations = state.conversations.map(c => c.id === payload.id ? ({...c, ...payload}) : c).sort((a, b) => String(b.id) === String(payload.id) ? 1 : -1);
    },
    updateIfLastConversation: (state, { payload }) => {
      state.conversations = state.conversations.map(c => c.id === payload.id && payload.lastMessageSent.id === c.lastMessageSent?.id ? ({...c, ...payload}) : c);
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
        state.conversations.sort((a, b) => new Date(b!.lastMessageSent!.created_at!).getTime() < new Date(a!.lastMessageSent!.created_at!).getTime() ? -1 : 1);
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
        state.conversations.sort((a, b) => new Date(b!.lastMessageSent!.created_at!).getTime() < new Date(a!.lastMessageSent!.created_at!).getTime() ? -1 : 1);
      }
    })
    .addCase(createConversationThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(addConversationPerticipentThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(addConversationPerticipentThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.conversations = state.conversations.map(c => c.id === action.payload.data.result.id ? ({...c, ...action.payload.data.result}) : c).sort((a, b) => String(b.id) === String(action.payload.data.result.id) ? 1 : -1);
      }
    })
    .addCase(addConversationPerticipentThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(removeConversationPerticipentThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(removeConversationPerticipentThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.conversations = state.conversations.map(c => c.id === action.payload.data.result.id ? ({...c, ...action.payload.data.result}) : c).sort((a, b) => String(b.id) === String(action.payload.data.result.id) ? 1 : -1);
      }
    })
    .addCase(removeConversationPerticipentThunk.rejected, (state) => {
      state.loading = false;
    })
})

export const { setConversationType, updateConversation, updateIfLastConversation, addConversation } = conversationSlice.actions
export default conversationSlice.reducer;