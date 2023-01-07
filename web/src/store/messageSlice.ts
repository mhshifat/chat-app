import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { createMessage, getMessages, updateMessage } from '../utils/api';
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
  messages: MessageDocument[];
}

const initialState: MessageState = {
  loading: false,
  messages: [],
}

export interface GetMessagesParams {
  conversationId: string;
}

export const getMessagesThunk = createAsyncThunk("message/get", async (params: GetMessagesParams) => getMessages(params));
export const createMessageThunk = createAsyncThunk("message/create", async (values: CreateMessageFormValues) => createMessage(values));
export const updateMessageThunk = createAsyncThunk("message/update", async ({ id, values }: { id: MessageDocument["id"], values: UpdateMessageFormValues }, { rejectWithValue }) => {
  return updateMessage(id, values).catch(err => rejectWithValue(err?.response?.data?.error))
});
export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getMessagesThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMessagesThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.messages = action.payload.data.result;
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
        state.messages.unshift(action.payload.data.result);
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
        const messageIdx = state.messages.findIndex(msg => msg.id === action.payload.data.result.id);
        state.messages[messageIdx] = action.payload.data.result;
      }
    })
    .addCase(updateMessageThunk.rejected, (state) => {
      state.loading = false;
    })
})

export const {} = messageSlice.actions
export default messageSlice.reducer;