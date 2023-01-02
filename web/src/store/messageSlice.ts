import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { createMessage, getMessages } from '../utils/api';
import { UserDocument } from './authSlice';
import { ConversationDocument } from './conversationSlice';
import { CreateMessageFormValues } from '../components/modules/Chat/ChatMessagesHolder/ChatMessagesHolderInput';

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
  mnessages: MessageDocument[];
}

const initialState: MessageState = {
  loading: false,
  mnessages: [],
}

export interface GetMessagesParams {
  conversationId: string;
}

export const getMessagesThunk = createAsyncThunk("message/get", async (params: GetMessagesParams) => getMessages(params));
export const createMessageThunk = createAsyncThunk("message/create", async (values: CreateMessageFormValues) => createMessage(values));
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
        state.mnessages = action.payload.data.result;
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
        state.mnessages.unshift(action.payload.data.result);
      }
    })
    .addCase(createMessageThunk.rejected, (state) => {
      state.loading = false;
    })
})

export const {} = messageSlice.actions
export default messageSlice.reducer;