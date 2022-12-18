import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { createConversation } from '../utils/api';
import { CreateConversationFormValues } from '../components/modules/Chat/CreateChatModal/CreateChatModal';

export interface ConversationDocument {
  id?: string;
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

export const createConversationThunk = createAsyncThunk("conversation/create", async (values: CreateConversationFormValues) => createConversation(values));
export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
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

export const {} = conversationSlice.actions
export default conversationSlice.reducer;