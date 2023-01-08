import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { createMessage, deleteMessage, getMessages, updateMessage } from '../utils/api';
import { UserDocument } from './authSlice';
import { ConversationDocument } from './conversationSlice';
import { CreateMessageFormValues, UpdateMessageFormValues } from '../components/modules/Chat/ChatMessagesHolder/ChatMessagesHolderInput';

export interface MessageDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  message: string;
  conversation?: ConversationDocument;
  writter?: UserDocument;
}

export interface MessageState {
  loading: boolean;
  messages: Record<string, MessageDocument[]>;
}

const initialState: MessageState = {
  loading: false,
  messages: {},
}

export interface GetMessagesParams {
  conversationId: string;
}

export const getMessagesThunk = createAsyncThunk("message/get", async (params: GetMessagesParams) => getMessages(params));
export const createMessageThunk = createAsyncThunk("message/create", async (values: CreateMessageFormValues) => createMessage(values));
export const updateMessageThunk = createAsyncThunk("message/update", async ({ id, values }: { id: MessageDocument["id"], values: UpdateMessageFormValues }, { rejectWithValue }) => {
  return updateMessage(id, values).catch(err => rejectWithValue(err?.response?.data?.error))
});
export const deleteMessageThunk = createAsyncThunk("message/delete", async (id: MessageDocument["id"], { rejectWithValue }) => {
  return deleteMessage(id).catch(err => rejectWithValue(err?.response?.data?.error))
});
export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages[String(payload.conversation.id)]?.unshift(payload);
    },
    updateMessageReducer: (state, { payload }) => {
      state.messages[String(payload.conversation.id)] = state.messages[String(payload.conversation.id)]?.map(msg => String(msg.id) === String(payload.id) ? payload : msg) || [];
    },
    deleteMessageReducer: (state, { payload }) => {
      state.messages[String(payload.conversation.id)] = state.messages[String(payload.conversation.id)]?.filter(msg => String(msg.id) !== String(payload.id)) || [];
    },
  },
  extraReducers: (builder) => builder
    .addCase(getMessagesThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMessagesThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        const newMsgs = action.payload.data.result;
        state.messages[String(newMsgs[0].conversation?.id)] = newMsgs;
      }
    })
    .addCase(getMessagesThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(createMessageThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(createMessageThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        const newMsg = action.payload.data.result;
        state.messages[String(newMsg.conversation?.id)].unshift(newMsg);
      }
    })
    .addCase(createMessageThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(updateMessageThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateMessageThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        const newMsg = action.payload.data.result;
        const messageIdx = state.messages[String(newMsg.conversation?.id)].findIndex(msg => msg.id === newMsg.id);
        state.messages[String(newMsg.conversation?.id)][messageIdx] = action.payload.data.result;
      }
    })
    .addCase(updateMessageThunk.rejected, (state) => {
      state.loading = false;
    })
    .addCase(deleteMessageThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteMessageThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        const newMsg = action.payload.data.result;
        state.messages[String(newMsg.conversation?.id)] = state.messages[String(newMsg.conversation?.id)].filter(msg => msg.id !== newMsg.id);
      }
    })
    .addCase(deleteMessageThunk.rejected, (state) => {
      state.loading = false;
    })
})

export const { addMessage, updateMessageReducer, deleteMessageReducer } = messageSlice.actions
export default messageSlice.reducer;